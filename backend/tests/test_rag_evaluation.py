import json
import os
import glob
import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.models.audit import AuditEvent, AIDecisionLog
from app.schemas.knowledge import DocumentUploadMetadata
from app.services.rag_service import RAGService
from app.services.document_parser import parse_markdown


@pytest.fixture(scope="module")
def seeded_db():
    """Create in-memory DB and seed it with the test policy corpus."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()

    rag_service = RAGService()
    corpus_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "knowledge_documents", "markdown"))

    md_files = glob.glob(os.path.join(corpus_root, "*.md"))
    for file_path in md_files:
        try:
            with open(file_path, "rb") as f:
                content = f.read()

            filename = os.path.basename(file_path)
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

            metadata = DocumentUploadMetadata(
                title=title,
                version=version,
                document_type="MARKDOWN",
                effective_date=eff_date,
                region=region,
                category=category,
                membership_tier=tier if tier != "ALL" else None,
                status="PUBLISHED" if doc_status.upper() in ("APPROVED", "PUBLISHED") else doc_status.upper(),
            )

            rag_service.ingest_document(
                db=db,
                content=content,
                filename=filename,
                metadata=metadata,
                uploaded_by="EVAL_SEED",
                request_id="seed-eval",
            )
        except Exception:
            pass

    yield db
    db.close()


def test_rag_evaluation_corpus_benchmark(seeded_db):
    """
    Evaluate RAG pipeline against cases from tests/rag_evaluation.json.
    Verifies answerable grounding, metadata filtering exclusion, and safe abstention.
    """
    eval_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "tests", "rag_evaluation.json"))
    if not os.path.exists(eval_json_path):
        pytest.skip(f"rag_evaluation.json not found at {eval_json_path}")

    with open(eval_json_path, "r", encoding="utf-8") as f:
        eval_data = json.load(f)

    rag_service = RAGService()
    cases = eval_data.get("cases", [])

    passed_count = 0
    total_evaluated = 0

    for case in cases:
        case_id = case["case_id"]
        case_type = case["case_type"]
        question = case["question"]
        region = case.get("query_region", "US")
        tier = case.get("query_membership_tier")

        res = rag_service.ask_knowledge(
            db=seeded_db,
            question=question,
            region=region,
            membership_tier=tier,
        )

        total_evaluated += 1

        if case_type == "answerable":
            # Must answer with sources and not abstain
            assert res.confidence in ("HIGH", "MEDIUM"), f"[{case_id}] Expected HIGH/MEDIUM, got {res.confidence}"
            assert res.followUpRequired is False, f"[{case_id}] Expected followUpRequired=False"
            assert len(res.sources) > 0, f"[{case_id}] Expected citations"
            passed_count += 1

        elif case_type == "filtering":
            # Excluded document must NOT be in cited sources
            expected_excluded_title = case.get("expected_title")
            cited_titles = [s.document for s in res.sources]
            if expected_excluded_title:
                assert expected_excluded_title not in cited_titles, (
                    f"[{case_id}] Filter violation: '{expected_excluded_title}' was retrieved despite being ineligible."
                )
            passed_count += 1

        elif case_type == "abstention":
            # Must abstain safely: LOW confidence and followUpRequired = True
            assert res.confidence == "LOW", f"[{case_id}] Expected LOW confidence abstention, got {res.confidence}"
            assert res.followUpRequired is True, f"[{case_id}] Expected followUpRequired=True"
            assert len(res.sources) == 0, f"[{case_id}] Expected 0 sources on abstention"
            passed_count += 1

        elif case_type == "metadata_and_safety":
            # Invariant check: Ineligible documents must never be cited
            if not case.get("must_cite"):
                # If must_cite is false, either it abstains or cites only eligible documents
                for src in res.sources:
                    assert "archived" not in src.document.lower(), f"[{case_id}] Cited archived policy: {src.document}"
                    assert "draft" not in src.document.lower(), f"[{case_id}] Cited draft policy: {src.document}"
                    assert "future" not in src.document.lower(), f"[{case_id}] Cited future policy: {src.document}"
            passed_count += 1

    print(f"\n[RAG Evaluation Complete] Passed {passed_count}/{total_evaluated} test cases!")
