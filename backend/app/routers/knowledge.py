import os
import glob
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.clerk_auth import get_optional_user, require_role, AuthUser
from app.schemas.knowledge import (
    KnowledgeAskRequest,
    KnowledgeAskResponse,
    DocumentResponse,
    DocumentDetailResponse,
    DocumentUploadMetadata,
)
from app.services.rag_service import get_rag_service, RAGService

router = APIRouter(tags=["Knowledge Assistant (RAG)"])


# PRD §8.3: POST /knowledge/ask (also mounted under prefix /api/v1/knowledge/ask)
@router.post("/knowledge/ask", response_model=KnowledgeAskResponse)
@router.post("/api/v1/knowledge/ask", response_model=KnowledgeAskResponse)
async def ask_knowledge(
    payload: KnowledgeAskRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[AuthUser] = Depends(get_optional_user),
    rag_service: RAGService = Depends(get_rag_service),
):
    """
    Ask a policy or support question grounded in approved enterprise documents.
    Returns the grounded answer, confidence level, verified source citations, and follow-up flag.
    """
    # Derive membership tier from logged-in user if not provided in request
    tier = payload.membershipTier
    if not tier and current_user and current_user.membership_tier:
        tier = current_user.membership_tier

    request_id = getattr(request.state, "request_id", "req-knowledge")

    return rag_service.ask_knowledge(
        db=db,
        question=payload.question,
        region=payload.region,
        category=payload.category,
        membership_tier=tier,
        actor_id=current_user.id if current_user else None,
        request_id=request_id,
    )


# PRD §8.4: POST /admin/knowledge/documents (admin-only)
@router.post("/admin/knowledge/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api/v1/admin/knowledge/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_knowledge_document(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    version: str = Form(...),
    document_type: Optional[str] = Form(None),
    effective_date: Optional[str] = Form(None),
    region: str = Form("ALL"),
    category: str = Form("GENERAL"),
    membership_tier: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    rag_service: RAGService = Depends(get_rag_service),
):
    """
    Upload and ingest an approved policy document (PDF, Markdown, or JSON).
    Validates file integrity and content, chunks sections, embeds, and saves atomically.
    Immutable: Duplicate (title, version) returns HTTP 409 Conflict.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    parsed_date = None
    if effective_date:
        try:
            parsed_date = date.fromisoformat(effective_date)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid effective_date format. Use YYYY-MM-DD.")

    meta = DocumentUploadMetadata(
        title=title,
        version=version,
        document_type=document_type,
        effective_date=parsed_date,
        region=region,
        category=category,
        membership_tier=membership_tier if membership_tier != "ALL" else None,
        status="PUBLISHED",
    )

    request_id = getattr(request.state, "request_id", "admin-upload")

    return rag_service.ingest_document(
        db=db,
        content=content,
        filename=file.filename or f"doc.{document_type or 'md'}",
        metadata=meta,
        uploaded_by=admin_user.id,
        request_id=request_id,
    )


# PRD §8.4: GET /admin/knowledge/documents
@router.get("/admin/knowledge/documents", response_model=List[DocumentResponse])
@router.get("/api/v1/admin/knowledge/documents", response_model=List[DocumentResponse])
def list_knowledge_documents(
    page: int = 0,
    size: int = 50,
    db: Session = Depends(get_db),
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    rag_service: RAGService = Depends(get_rag_service),
):
    """List document versions, approval status, and chunk counts."""
    return rag_service.list_documents(db=db, page=page, size=size)


# PRD §8.4: GET /admin/knowledge/documents/{id}
@router.get("/admin/knowledge/documents/{doc_id}", response_model=DocumentDetailResponse)
@router.get("/api/v1/admin/knowledge/documents/{doc_id}", response_model=DocumentDetailResponse)
def get_knowledge_document_detail(
    doc_id: int,
    db: Session = Depends(get_db),
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    rag_service: RAGService = Depends(get_rag_service),
):
    """Retrieve document metadata along with all extracted sections and chunks."""
    return rag_service.get_document(db=db, doc_id=doc_id)


# Admin Utility: POST /admin/knowledge/seed
@router.post("/admin/knowledge/seed")
@router.post("/api/v1/admin/knowledge/seed")
def seed_knowledge_corpus(
    db: Session = Depends(get_db),
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    rag_service: RAGService = Depends(get_rag_service),
):
    """
    Bulk seed policy documents from data/knowledge_documents/ into the database.
    """
    corpus_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "knowledge_documents"))
    if not os.path.exists(corpus_root):
        corpus_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "knowledge_documents"))

    if not os.path.exists(corpus_root):
        raise HTTPException(status_code=404, detail=f"Knowledge documents corpus folder not found at {corpus_root}")

    seeded = []
    skipped = []
    errors = []

    # Process markdown files first (richest metadata)
    md_files = glob.glob(os.path.join(corpus_root, "markdown", "*.md"))
    for file_path in md_files:
        try:
            with open(file_path, "rb") as f:
                content = f.read()

            filename = os.path.basename(file_path)
            # Basic metadata extraction from filename or content
            text_str = content.decode("utf-8")
            from app.services.document_parser import parse_markdown
            meta_extracted, _ = parse_markdown(text_str)

            title = meta_extracted.get("title") or filename.replace(".md", "").replace("-", " ").title()
            version = meta_extracted.get("version") or "2026.1"
            doc_status = meta_extracted.get("status") or "PUBLISHED"
            region = meta_extracted.get("region") or "ALL"
            category = meta_extracted.get("category") or "GENERAL"
            tier = meta_extracted.get("membership_tier")

            meta = DocumentUploadMetadata(
                title=title,
                version=version,
                document_type="MARKDOWN",
                region=region,
                category=category,
                membership_tier=tier if tier != "ALL" else None,
                status=doc_status,
            )

            try:
                res = rag_service.ingest_document(
                    db=db,
                    content=content,
                    filename=filename,
                    metadata=meta,
                    uploaded_by="SYSTEM_SEED",
                )
                seeded.append({"title": title, "version": version, "chunks": res.chunkCount})
            except HTTPException as e:
                if e.status_code == 409:
                    skipped.append(f"{title} v{version} (already exists)")
                else:
                    errors.append(f"{filename}: {e.detail}")
        except Exception as e:
            errors.append(f"{os.path.basename(file_path)}: {str(e)}")

    return {
        "status": "complete",
        "seeded_count": len(seeded),
        "skipped_count": len(skipped),
        "error_count": len(errors),
        "seeded": seeded,
        "errors": errors[:5],
    }
