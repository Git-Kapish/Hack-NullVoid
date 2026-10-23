from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class CreateTicketRequest(BaseModel):
    subject: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    orderId: Optional[int] = None


class SupportTicketResponse(BaseModel):
    id: int
    userId: str
    orderId: Optional[int] = None
    subject: str
    description: str
    status: str
    createdAt: datetime
