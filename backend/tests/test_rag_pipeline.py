import pytest
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.models.audit import AuditEvent, AIDecisionLog
from app.schemas.knowledge import DocumentUploadMetadata
from app.services.document_parser import (
    sniff_content,
    parse_markdown,
    parse_json_document,
    chunk_sections,
)
from app.services.rag_service import RAGService
from fastapi import HTTPException


@pytest.fixture
def db_session():
    """Create a temporary in-memory SQLite database for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_content_sniffing_and_validation():
    """Verify that file sniffing rejects invalid formats and malicious contents."""
    # 1. Invalid PDF (missing %PDF- header)
    with pytest.raises(ValueError, match="Invalid PDF format"):
        sniff_content(b"NOT A REAL PDF FILE CONTENT", "PDF")

    # 2. Invalid JSON (corrupted JSON text)
    with pytest.raises(ValueError, match="Malformed JSON"):
        sniff_content(b"{ invalid_json: 123 ", "JSON")

    # 3. Invalid Markdown (contains null bytes)
    with pytest.raises(ValueError, match="null bytes"):
        sniff_content(b"# Markdown Title\x00 with null byte", "MARKDOWN")

    # 4. Valid Markdown passes
    sniff_content(b"# Valid Policy\n\nThis is a standard markdown policy.", "MARKDOWN")


def test_markdown_and_json_parsing():
    """Verify section extraction and chunking preserving headings."""
    md_content = """# Returns Policy

- document_id: POL-TEST-001
- title: Test Returns Policy
- version: 2026.1
- region: US
- status: APPROVED

## General Terms
Returns are accepted within 30 days of purchase with original packaging.

## Opened Electronics
Opened laptops may be returned within 7 days without physical damage.
"""
    meta, sections = parse_markdown(md_content)
    assert meta["title"] == "Test Returns Policy"
    assert meta["version"] == "2026.1"
    assert len(sections) == 2
    assert sections[0]["section_title"] == "General Terms"
    assert sections[1]["section_title"] == "Opened Electronics"

    # Chunking test
    chunks = chunk_sections(sections, target_chunk_size=800, overlap=100)
    assert len(chunks) == 2
    assert chunks[0]["section_title"] == "General Terms"
    assert chunks[1]["section_title"] == "Opened Electronics"


def test_version_immutability_conflict(db_session):
    """Verify that re-uploading an existing (title, version) document returns HTTP 409."""
    rag_service = RAGService()
    content = b"# Warranty Policy\n\n## Coverage\nStandard 1-year hardware warranty."
    meta = DocumentUploadMetadata(
        title="Laptop Warranty",
        version="2026.1",
        document_type="MARKDOWN",
        region="US",
        status="PUBLISHED",
    )

    # First upload succeeds
    doc1 = rag_service.ingest_document(db=db_session, content=content, filename="warranty.md", metadata=meta)
    assert doc1.title == "Laptop Warranty"
    assert doc1.version == "2026.1"

    # Duplicate upload raises HTTP 409 Conflict
    with pytest.raises(HTTPException) as exc_info:
        rag_service.ingest_document(db=db_session, content=content, filename="warranty.md", metadata=meta)
    assert exc_info.value.status_code == 409
    assert "already exists" in exc_info.value.detail


def test_metadata_filtering_and_abstention(db_session):
    """
    Verify:
    1. Future-effective date documents are excluded
    2. Superseded documents are excluded
    3. Mismatched regional documents are excluded
    4. Unanswerable queries safely abstain with LOW confidence and no fabrication
    """
    rag_service = RAGService()

    # 1. Ingest an ACTIVE approved policy (effective today)
    active_content = b"# Laptop Returns\n\n## Opened Laptops\nOpened laptops can be returned within 7 days of delivery without customer damage."
    active_meta = DocumentUploadMetadata(
        title="Laptop Return Policy",
        version="2026.1",
        document_type="MARKDOWN",
        effective_date=date.today(),
        region="US",
        status="PUBLISHED",
    )
    rag_service.ingest_document(db=db_session, content=active_content, filename="active.md", metadata=active_meta)

    # 2. Ingest a FUTURE-EFFECTIVE policy (effective next year)
    future_content = b"# Future Shipping Policy\n\n## Fast Shipping\nDelivery in 10 minutes guaranteed."
    future_meta = DocumentUploadMetadata(
        title="Future Shipping Policy",
        version="2027.1",
        document_type="MARKDOWN",
        effective_date=date.today() + timedelta(days=365),
        region="US",
        status="PUBLISHED",
    )
    rag_service.ingest_document(db=db_session, content=future_content, filename="future.md", metadata=future_meta)

    # 3. Ingest a SUPERSEDED archived policy
    archived_content = b"# Old Returns Policy\n\n## Archived\nHistorical 90-day returns."
    archived_meta = DocumentUploadMetadata(
        title="Old Returns Policy",
        version="2024.1",
        document_type="MARKDOWN",
        effective_date=date(2024, 1, 1),
        region="US",
        status="SUPERSEDED",
    )
    rag_service.ingest_document(db=db_session, content=archived_content, filename="old.md", metadata=archived_meta)

    # 4. Ingest a UK-ONLY policy
    uk_content = b"# UK Returns Policy\n\n## UK Process\nUK customers receive pre-paid Royal Mail return labels."
    uk_meta = DocumentUploadMetadata(
        title="UK Returns Policy",
        version="2026.1",
        document_type="MARKDOWN",
        effective_date=date.today(),
        region="UK",
        status="PUBLISHED",
    )
    rag_service.ingest_document(db=db_session, content=uk_content, filename="uk.md", metadata=uk_meta)

    # TEST A: Answerable question against US policy -> retrieve active document
    res_answerable = rag_service.ask_knowledge(
        db=db_session,
        question="What is the return window for an opened laptop?",
        region="US",
    )
    assert res_answerable.confidence in ("HIGH", "MEDIUM")
    assert res_answerable.followUpRequired is False
    assert len(res_answerable.sources) > 0
    assert any(s.document == "Laptop Return Policy" for s in res_answerable.sources)
    assert not any(s.document == "Future Shipping Policy" for s in res_answerable.sources)
    assert not any(s.document == "Old Returns Policy" for s in res_answerable.sources)

    # TEST B: Question with US region should NOT retrieve UK-only document
    res_us_query = rag_service.ask_knowledge(
        db=db_session,
        question="Tell me about pre-paid Royal Mail labels",
        region="US",
    )
    # UK document must be filtered out by SQL region filter
    assert not any(s.document == "UK Returns Policy" for s in res_us_query.sources)

    # TEST C: Query with UK region CAN retrieve UK document
    res_uk_query = rag_service.ask_knowledge(
        db=db_session,
        question="How do UK customers handle return labels?",
        region="UK",
    )
    assert any(s.document == "UK Returns Policy" for s in res_uk_query.sources)

    # TEST D: Unanswerable query -> Safe Abstention
    res_unanswerable = rag_service.ask_knowledge(
        db=db_session,
        question="What exact date will my bank post my refund?",
        region="US",
    )
    assert res_unanswerable.confidence == "LOW"
    assert res_unanswerable.followUpRequired is True
    assert "policy documents do not support an answer" in res_unanswerable.answer.lower()
    assert len(res_unanswerable.sources) == 0

    # TEST E: AI Decision log was created
    decision_logs = db_session.query(AIDecisionLog).all()
    assert len(decision_logs) >= 3
    outcomes = [log.outcome for log in decision_logs]
    assert "ANSWERED" in outcomes
    assert "ABSTAINED" in outcomes
