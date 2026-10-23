from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorResponse(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")
    requestId: str = Field(..., description="Correlation request ID")


class PaginationParams(BaseModel):
    page: int = Field(0, ge=0, description="Page index (0-based)")
    size: int = Field(12, ge=1, le=50, description="Page size (capped at 50)")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    totalPages: int
