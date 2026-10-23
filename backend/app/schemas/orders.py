from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class OrderItemResponse(BaseModel):
    id: int
    productId: int
    productName: str
    unitPrice: float
    quantity: int
    subtotal: float


class ShipmentEventResponse(BaseModel):
    id: int
    status: str
    location: str
    eventTime: datetime


class OrderResponse(BaseModel):
    id: int
    userId: str
    status: str
    totalAmount: float
    createdAt: datetime
    items: List[OrderItemResponse] = []
    shipmentEvents: List[ShipmentEventResponse] = []


class CheckoutRequest(BaseModel):
    shippingAddress: Optional[str] = Field(None, description="Simulated shipping destination")
