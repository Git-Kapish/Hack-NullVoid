import logging
import math
from datetime import date, datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func

from app.core.config import settings
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.models.audit import AuditEvent, AIDecisionLog
from app.ai.llm_client import get_llm_client, GroundedAnswerSchema
from app.ai.prompts import RAG_KNOWLEDGE_SYSTEM_PROMPT
from app.schemas.knowledge import (
    KnowledgeAskResponse,
    KnowledgeSourceItem,
    DocumentResponse,
    DocumentDetailResponse,
    ChunkResponse,
    DocumentUploadMetadata,
)
from app.services.document_parser import (
    sniff_content,
    parse_markdown,
    parse_json_document,
    parse_pdf_document,
    chunk_sections,
)

logger = logging.getLogger(__name__)


def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two float vectors."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)


class RAGService:
    def __init__(self):
        self.llm_client = get_llm_client()

    def ingest_document(
        self,
        db: Session,
        content: bytes,
        filename: str,
        metadata: DocumentUploadMetadata,
        uploaded_by: Optional[str] = "ADMIN",
        request_id: Optional[str] = "ingest-system",
    ) -> DocumentResponse:
        """
        Validate, extract, chunk, embed, and store document in a single atomic transaction.
        Enforces immutable versioning (409 Conflict if title and version already exist).
        """
        # 1. Determine and validate document type
        doc_type = metadata.document_type
        if not doc_type:
            lower_name = filename.lower()
            if lower_name.endswith(".pdf"):
                doc_type = "PDF"
            elif lower_name.endswith(".json"):
                doc_type = "JSON"
            elif lower_name.endswith((".md", ".markdown")):
                doc_type = "MARKDOWN"
            else:
                doc_type = "MARKDOWN"

        # 2. Content sniffing and size limit check
        sniff_content(content, doc_type)

        # 3. Enforce Version Immutability: (title, version) must be unique
        existing = db.query(KnowledgeDocument).filter(
            KnowledgeDocument.title == metadata.title,
            KnowledgeDocument.version == metadata.version,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Document version '{metadata.version}' for '{metadata.title}' already exists. Published versions are immutable.",
            )

        # 4. Extract sections based on document type
        extracted_meta = {}
        if doc_type.upper() == "PDF":
            extracted_meta, sections = parse_pdf_document(content)
        elif doc_type.upper() == "JSON":
            extracted_meta, sections = parse_json_document(content.decode("utf-8"))
        else:
            extracted_meta, sections = parse_markdown(content.decode("utf-8"))

        if not sections:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document contains no extractable content or sections.",
            )

        # 5. Chunk sections (~800 chars, ~100 chars overlap)
        chunks_data = chunk_sections(sections, target_chunk_size=800, overlap=100)

        # 6. Generate vector embeddings in batch
        chunk_texts = [c["content"] for c in chunks_data]
        embeddings = self.llm_client.embed(chunk_texts)

        # 7. Persist document and all chunks within a single transaction
        effective_date_val = metadata.effective_date or date.today()
        if not metadata.effective_date and "effective_date" in extracted_meta and extracted_meta["effective_date"]:
            try:
                effective_date_val = date.fromisoformat(str(extracted_meta["effective_date"]))
            except Exception:
                effective_date_val = date.today()

        region_val = metadata.region if metadata.region != "ALL" else (extracted_meta.get("region") or "ALL")
        category_val = metadata.category if metadata.category != "GENERAL" else (extracted_meta.get("category") or "GENERAL")
        tier_val = metadata.membership_tier or extracted_meta.get("membership_tier")

        doc = KnowledgeDocument(
            title=metadata.title,
            document_type=doc_type.upper(),
            version=metadata.version,
            effective_date=effective_date_val,
            region=region_val,
            category=category_val,
            membership_tier=tier_val,
            status=metadata.status or "PUBLISHED",
            uploaded_by=uploaded_by,
        )
        db.add(doc)
        db.flush()  # obtain doc.id

        for idx, c in enumerate(chunks_data):
            emb = embeddings[idx] if idx < len(embeddings) else None
            chunk = KnowledgeChunk(
                document_id=doc.id,
                chunk_index=c["chunk_index"],
                section_title=c["section_title"],
                content=c["content"],
                embedding=emb,
                chunk_metadata={"char_count": len(c["content"])},
            )
            db.add(chunk)

        # 8. Record audit event
        audit = AuditEvent(
            actor_id=None,
            action="DOCUMENT_UPLOAD",
            resource_type="KNOWLEDGE_DOC",
            resource_id=str(doc.id),
            outcome="SUCCESS",
            request_id=request_id or "ingest-system",
        )
        db.add(audit)
        db.commit()
        db.refresh(doc)

        logger.info(f"Ingested document '{doc.title}' v{doc.version} (id={doc.id}) with {len(chunks_data)} chunks.")

        return DocumentResponse(
            id=doc.id,
            title=doc.title,
            version=doc.version,
            documentType=doc.document_type,
            region=doc.region,
            category=doc.category,
            membershipTier=doc.membership_tier,
            status=doc.status,
            effectiveDate=str(doc.effective_date),
            chunkCount=len(chunks_data),
        )

    def list_documents(self, db: Session, page: int = 0, size: int = 50) -> List[DocumentResponse]:
        """Admin document listing with version inspection."""
        docs = (
            db.query(KnowledgeDocument)
            .order_by(KnowledgeDocument.created_at.desc())
            .offset(page * size)
            .limit(size)
            .all()
        )
        result = []
        for d in docs:
            chunk_count = len(d.chunks)
            result.append(
                DocumentResponse(
                    id=d.id,
                    title=d.title,
                    version=d.version,
                    documentType=d.document_type,
                    region=d.region,
                    category=d.category,
                    membershipTier=d.membership_tier,
                    status=d.status,
                    effectiveDate=str(d.effective_date),
                    chunkCount=chunk_count,
                )
            )
        return result

    def get_document(self, db: Session, doc_id: int) -> DocumentDetailResponse:
        """Fetch document detail with all chunks."""
        doc = db.query(KnowledgeDocument).filter(KnowledgeDocument.id == doc_id).first()
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        chunks_res = [
            ChunkResponse(
                id=c.id,
                chunkIndex=c.chunk_index,
                sectionTitle=c.section_title,
                content=c.content,
            )
            for c in doc.chunks
        ]

        return DocumentDetailResponse(
            id=doc.id,
            title=doc.title,
            version=doc.version,
            documentType=doc.document_type,
            region=doc.region,
            category=doc.category,
            membershipTier=doc.membership_tier,
            status=doc.status,
            effectiveDate=str(doc.effective_date),
            chunks=chunks_res,
        )

    def retrieve_chunks(
        self,
        db: Session,
        question: str,
        region: Optional[str] = "US",
        category: Optional[str] = None,
        membership_tier: Optional[str] = None,
        top_k: int = 5,
    ) -> List[Tuple[KnowledgeChunk, float]]:
        """
        Perform SQL vector similarity retrieval with mandatory in-database metadata filtering.
        Filters excluded documents (status != PUBLISHED/APPROVED, future effective date, region, tier).
        """
        question_embeddings = self.llm_client.embed([question])
        q_vec = question_embeddings[0] if question_embeddings else []
        today_val = date.today()

        # Build base query joining KnowledgeDocument
        query = db.query(KnowledgeChunk).join(KnowledgeDocument)

        # In-database metadata filtering
        filters = [
            KnowledgeDocument.status.in_(["PUBLISHED", "APPROVED"]),
            KnowledgeDocument.effective_date <= today_val,
        ]

        if region and region != "ALL":
            filters.append(
                or_(
                    KnowledgeDocument.region == region,
                    KnowledgeDocument.region == "ALL",
                )
            )

        if category and category != "ALL":
            filters.append(
                or_(
                    KnowledgeDocument.category == category,
                    KnowledgeDocument.category == "GENERAL",
                )
            )

        if membership_tier and membership_tier != "ALL":
            filters.append(
                or_(
                    KnowledgeDocument.membership_tier.is_(None),
                    KnowledgeDocument.membership_tier == "ALL",
                    KnowledgeDocument.membership_tier == membership_tier,
                )
            )

        query = query.filter(and_(*filters)).options(joinedload(KnowledgeChunk.document))

        # Check if database dialect supports pgvector cosine distance directly
        is_postgres = db.bind is not None and db.bind.dialect.name == "postgresql"
        scored_chunks: List[Tuple[KnowledgeChunk, float]] = []

        if is_postgres:
            try:
                # Use pgvector <=> cosine distance operator
                results = (
                    query.order_by(KnowledgeChunk.embedding.cosine_distance(q_vec))
                    .limit(top_k)
                    .all()
                )
                for chunk in results:
                    dist = _cosine_similarity(list(chunk.embedding), q_vec) if chunk.embedding is not None else 0.0
                    scored_chunks.append((chunk, dist))
                return scored_chunks
            except Exception as e:
                logger.warning(f"Postgres vector query fallback to python scoring: {e}")
                db.rollback()

        # Universal fallback (exact cosine similarity in memory across eligible filtered chunks)
        candidates = query.all()
        for chunk in candidates:
            if chunk.embedding is not None:
                sim = _cosine_similarity(list(chunk.embedding), q_vec)
                scored_chunks.append((chunk, sim))

        # Sort descending by similarity score
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]

    def ask_knowledge(
        self,
        db: Session,
        question: str,
        region: Optional[str] = "US",
        category: Optional[str] = None,
        membership_tier: Optional[str] = None,
        actor_id: Optional[str] = None,
        request_id: Optional[str] = "rag-request",
    ) -> KnowledgeAskResponse:
        """
        Execute grounded RAG question answering pipeline:
        1. In-database vector search with metadata filtering
        2. Retrieval-based confidence calculation (HIGH, MEDIUM, LOW)
        3. Safe abstention on low confidence (no LLM generation)
        4. Constrained LLM generation with untrusted context defense
        5. Database-sourced provenance attribution
        6. AI decision logging to ai_decision_logs
        """
        # 1. Retrieve eligible chunks
        retrieved = self.retrieve_chunks(
            db=db,
            question=question,
            region=region,
            category=category,
            membership_tier=membership_tier,
            top_k=settings.RAG_TOP_K,
        )

        top_similarity = retrieved[0][1] if retrieved else 0.0
        second_similarity = retrieved[1][1] if len(retrieved) > 1 else 0.0

        # 2. Derive confidence strictly from retrieval metrics (not from LLM self-assessment)
        if top_similarity >= settings.RAG_SIMILARITY_THRESHOLD_HIGH and second_similarity >= settings.RAG_SIMILARITY_THRESHOLD_MED:
            confidence = "HIGH"
        elif top_similarity >= settings.RAG_SIMILARITY_THRESHOLD_MED:
            confidence = "MEDIUM"
        else:
            confidence = "LOW"

        # 3. Safe Abstention: If confidence is LOW or no chunks found, abstain immediately
        if confidence == "LOW" or not retrieved:
            safe_answer = "The policy documents do not support an answer."
            self._log_decision(
                db=db,
                actor_id=actor_id,
                request_id=request_id,
                question=question,
                filters={"region": region, "category": category, "membership_tier": membership_tier},
                retrieved_chunks=retrieved,
                answer=safe_answer,
                sources=[],
                confidence="LOW",
                outcome="ABSTAINED",
            )
            return KnowledgeAskResponse(
                answer=safe_answer,
                confidence="LOW",
                sources=[],
                followUpRequired=True,
            )

        # 4. Assemble context from top chunks
        context_parts = []
        for chunk, sim in retrieved:
            context_parts.append(
                f"[Chunk ID: {chunk.id}] (Document: '{chunk.document.title}', Section: '{chunk.section_title}', Version: '{chunk.document.version}', Score: {sim:.3f}):\n{chunk.content}"
            )
        context_str = "\n\n".join(context_parts)

        user_prompt = f"Question: {question}\n\nNumbered Policy Context:\n{context_str}"

        # 5. Constrained generation via LLM structured extraction
        try:
            grounded_res: GroundedAnswerSchema = self.llm_client.extract_structured(
                schema=GroundedAnswerSchema,
                system_prompt=RAG_KNOWLEDGE_SYSTEM_PROMPT,
                user_prompt=user_prompt,
            )
        except Exception as e:
            logger.error(f"Grounded generation failed: {e}")
            grounded_res = GroundedAnswerSchema(
                answer="The policy documents do not support an answer.",
                used_chunk_ids=[],
                supported=False,
            )

        # If LLM indicates unsupported context, abstain safely
        if not grounded_res.supported:
            safe_answer = "The policy documents do not support an answer."
            self._log_decision(
                db=db,
                actor_id=actor_id,
                request_id=request_id,
                question=question,
                filters={"region": region, "category": category, "membership_tier": membership_tier},
                retrieved_chunks=retrieved,
                answer=safe_answer,
                sources=[],
                confidence="LOW",
                outcome="ABSTAINED",
            )
            return KnowledgeAskResponse(
                answer=safe_answer,
                confidence="LOW",
                sources=[],
                followUpRequired=True,
            )

        # 6. Database Source Attribution: Reconstruct sources directly from verified database records
        used_ids = grounded_res.used_chunk_ids or [c.id for c, _ in retrieved[:2]]
        cited_chunks = (
            db.query(KnowledgeChunk)
            .options(joinedload(KnowledgeChunk.document))
            .filter(KnowledgeChunk.id.in_(used_ids))
            .all()
        )

        # If used_chunk_ids didn't match anything in DB, fall back to top retrieved chunk
        if not cited_chunks and retrieved:
            cited_chunks = [retrieved[0][0]]

        sources: List[KnowledgeSourceItem] = []
        seen = set()
        for c in cited_chunks:
            key = (c.document.title, c.section_title, c.document.version)
            if key not in seen:
                seen.add(key)
                sources.append(
                    KnowledgeSourceItem(
                        document=c.document.title,
                        section=c.section_title,
                        version=c.document.version,
                    )
                )

        # 7. Record AI Decision Log
        self._log_decision(
            db=db,
            actor_id=actor_id,
            request_id=request_id,
            question=question,
            filters={"region": region, "category": category, "membership_tier": membership_tier},
            retrieved_chunks=retrieved,
            answer=grounded_res.answer,
            sources=sources,
            confidence=confidence,
            outcome="ANSWERED",
        )

        return KnowledgeAskResponse(
            answer=grounded_res.answer,
            confidence=confidence,
            sources=sources,
            followUpRequired=False,
        )

    def _log_decision(
        self,
        db: Session,
        actor_id: Optional[str],
        request_id: Optional[str],
        question: str,
        filters: Dict[str, Any],
        retrieved_chunks: List[Tuple[KnowledgeChunk, float]],
        answer: str,
        sources: List[KnowledgeSourceItem],
        confidence: str,
        outcome: str,
    ) -> None:
        """Record decision log to ai_decision_logs table."""
        try:
            candidate_list = [
                {
                    "chunk_id": c.id,
                    "doc_id": c.document_id,
                    "doc_title": c.document.title,
                    "section": c.section_title,
                    "similarity": round(sim, 4),
                }
                for c, sim in retrieved_chunks
            ]
            sources_summary = [s.model_dump() for s in sources]

            log_entry = AIDecisionLog(
                actor_id=None,  # actor_id is Integer FK or None for public
                request_id=request_id or f"req-{int(datetime.now(timezone.utc).timestamp())}",
                decision_type="KNOWLEDGE_ANSWER",
                input_params={"question": question, "filters": filters},
                output_result={
                    "answer": answer,
                    "confidence": confidence,
                    "sources": sources_summary,
                    "candidates": candidate_list,
                },
                model_id=settings.GEMINI_MODEL,
                outcome=outcome,
            )
            db.add(log_entry)
            db.commit()
        except Exception as e:
            logger.warning(f"Could not record AI decision log: {e}")
            db.rollback()


_rag_service = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
