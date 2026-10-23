from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.catalog import ProductListItem


class CartItemResponse(BaseModel):
    id: int
    productId: int
    quantity: int
    product: ProductListItem
    itemTotal: float


class CartResponse(BaseModel):
    id: int
    userId: str
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    itemCount: int = 0


class AddToCartRequest(BaseModel):
    productId: int = Field(..., description="ID of product to add")
    quantity: int = Field(1, ge=1, description="Quantity (must be at least 1)")


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(..., ge=1, description="New quantity")
