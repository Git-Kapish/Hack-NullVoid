from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.db.session import Base
from app.core.config import settings


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    document_type = Column(String(20), nullable=False)  # PDF, MARKDOWN, JSON
    version = Column(String(50), nullable=False)
    effective_date = Column(Date, nullable=False, default=date.today, index=True)
    region = Column(String(50), nullable=False, default="ALL", index=True)
    category = Column(String(100), nullable=False, default="GENERAL", index=True)
    membership_tier = Column(String(50), nullable=True, index=True)  # NULL applies to all, else BASIC, PRIME, PREMIUM
    status = Column(String(50), nullable=False, default="PUBLISHED", index=True)  # DRAFT, PUBLISHED, SUPERSEDED, INACTIVE, FAILED
    uploaded_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("title", "version", name="uq_document_title_version"),
    )

    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan", order_by="KnowledgeChunk.chunk_index")


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("knowledge_documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    section_title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(settings.EMBED_DIM), nullable=True)
    chunk_metadata = Column("metadata", JSON, nullable=True)

    document = relationship("KnowledgeDocument", back_populates="chunks")
