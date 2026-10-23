from typing import List, Optional, Any
from pydantic import BaseModel, Field


class RecommendationItem(BaseModel):
    productId: int
    productName: str
    reason: str
    availability: str
    price: float


class RecommendationRequest(BaseModel):
    query: str = Field(..., description="Natural language shopping request")
    budget: Optional[float] = Field(None, ge=0, description="Optional maximum budget")


class RecommendationResponse(BaseModel):
    interpretedRequirement: str
    budget: Optional[float] = None
    recommendations: List[RecommendationItem] = []
    clarifyingQuestion: Optional[str] = None


class SmartSearchRequest(BaseModel):
    query: str = Field(..., description="Natural language search phrase")


class SmartSearchResponse(BaseModel):
    expandedQuery: str
    detectedCategory: Optional[str] = None
    maxPrice: Optional[float] = None
    extractedKeywords: List[str] = []


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    suggestedProductIds: List[int] = []
