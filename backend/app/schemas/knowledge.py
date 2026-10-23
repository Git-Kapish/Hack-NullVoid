from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class KnowledgeSourceItem(BaseModel):
    document: str = Field(..., description="Official title of the policy document")
    section: str = Field(..., description="Section heading within the document")
    version: str = Field(..., description="Document version number, e.g. 2026.1")


class KnowledgeAskRequest(BaseModel):
    question: str = Field(..., min_length=3, description="Natural language policy or support question")
    region: Optional[str] = Field("US", description="Target region filter, e.g. US, UK, ALL")
    category: Optional[str] = Field(None, description="Optional document category filter")
    membershipTier: Optional[str] = Field(None, description="Optional customer membership tier, e.g. BASIC, PRIME, PREMIUM")


class KnowledgeAskResponse(BaseModel):
    answer: str = Field(..., description="Grounded answer synthesized from verified policy sources")
    confidence: str = Field(..., description="Confidence grade: HIGH, MEDIUM, or LOW")
    sources: List[KnowledgeSourceItem] = Field(default_factory=list, description="Verified source attributions from database")
    followUpRequired: bool = Field(False, description="True if evidence is insufficient or question requires support escalation")


class DocumentUploadMetadata(BaseModel):
    title: str = Field(..., min_length=1)
    version: str = Field(..., min_length=1)
    document_type: Optional[str] = Field(None, description="PDF, MARKDOWN, or JSON")
    effective_date: Optional[date] = Field(None)
    region: str = Field("ALL")
    category: str = Field("GENERAL")
    membership_tier: Optional[str] = Field(None)
    status: str = Field("PUBLISHED")


class ChunkResponse(BaseModel):
    id: int
    chunkIndex: int
    sectionTitle: str
    content: str


class DocumentResponse(BaseModel):
    id: int
    title: str
    version: str
    documentType: str
    region: str
    category: str
    membershipTier: Optional[str] = None
    status: str
    effectiveDate: str
    chunkCount: int = 0


class DocumentDetailResponse(BaseModel):
    id: int
    title: str
    version: str
    documentType: str
    region: str
    category: str
    membershipTier: Optional[str] = None
    status: str
    effectiveDate: str
    chunks: List[ChunkResponse] = []
