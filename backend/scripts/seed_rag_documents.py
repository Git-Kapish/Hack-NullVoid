import os
import sys
import glob
from datetime import date

# Ensure backend root is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.db.session import engine, SessionLocal, Base
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.models.audit import AuditEvent, AIDecisionLog
from app.schemas.knowledge import DocumentUploadMetadata
from app.services.rag_service import get_rag_service
from app.services.document_parser import parse_markdown, parse_json_document


def seed_corpus():
    print("=" * 60)
    print("ShopSmart AI — RAG Knowledge Base Seeder")
    print("=" * 60)

    # Ensure tables exist
    print("[1/3] Ensuring knowledge and audit tables exist in database...")
    Base.metadata.create_all(bind=engine)
    print("  -> Database tables initialized.")

    # Locate dataset directory
    corpus_root = os.path.abspath(os.path.join(backend_dir, "..", "data", "knowledge_documents"))
    if not os.path.exists(corpus_root):
        print(f"Error: Knowledge corpus not found at {corpus_root}")
        sys.exit(1)

    rag_service = get_rag_service()
    db = SessionLocal()

    total_ingested = 0
    total_chunks = 0
    skipped_count = 0
    failed_count = 0

    print(f"[2/3] Scanning corpus at: {corpus_root}")

    # Ingest Markdown files
    md_files = sorted(glob.glob(os.path.join(corpus_root, "markdown", "*.md")))
    print(f"  Found {len(md_files)} Markdown policy files.")

    for file_path in md_files:
        filename = os.path.basename(file_path)
        try:
            with open(file_path, "rb") as f:
                content = f.read()

            meta_extracted, _ = parse_markdown(content.decode("utf-8"))

            title = meta_extracted.get("title") or filename.replace(".md", "").replace("-", " ").title()
            version = meta_extracted.get("version") or "2026.1"
            doc_status = meta_extracted.get("status") or "APPROVED"
            region = meta_extracted.get("region") or "ALL"
            category = meta_extracted.get("category") or "General"
            tier = meta_extracted.get("membership_tier")

            eff_date = date.today()
            if "effective_date" in meta_extracted and meta_extracted["effective_date"]:
                try:
                    eff_date = date.fromisoformat(str(meta_extracted["effective_date"]))
                except Exception:
                    eff_date = date.today()

            # Map status if needed (e.g., APPROVED -> PUBLISHED)
            if doc_status.upper() in ("APPROVED", "PUBLISHED"):
                status_val = "PUBLISHED"
            else:
                status_val = doc_status.upper()

            metadata = DocumentUploadMetadata(
                title=title,
                version=version,
                document_type="MARKDOWN",
                effective_date=eff_date,
                region=region,
                category=category,
                membership_tier=tier if tier != "ALL" else None,
                status=status_val,
            )

            # Check if exists
            existing = db.query(KnowledgeDocument).filter(
                KnowledgeDocument.title == title,
                KnowledgeDocument.version == version,
            ).first()

            if existing:
                skipped_count += 1
                continue

            res = rag_service.ingest_document(
                db=db,
                content=content,
                filename=filename,
                metadata=metadata,
                uploaded_by="SEED_SCRIPT",
                request_id="seed-initial-corpus",
            )
            total_ingested += 1
            total_chunks += res.chunkCount

        except Exception as e:
            print(f"  [!] Failed to ingest {filename}: {e}")
            failed_count += 1

    db.close()

    print("[3/3] Seeding Summary:")
    print(f"  - Newly Ingested Documents: {total_ingested}")
    print(f"  - Total Generated Chunks:   {total_chunks}")
    print(f"  - Already Existing / Skipped: {skipped_count}")
    print(f"  - Failed Ingestions:        {failed_count}")
    print("=" * 60)
    print("RAG Knowledge Base Seeding Complete!")


if __name__ == "__main__":
    seed_corpus()
