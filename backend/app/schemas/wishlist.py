from typing import List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.catalog import ProductListItem


class WishlistItemResponse(BaseModel):
    productId: int
    createdAt: datetime
    product: ProductListItem


class WishlistResponse(BaseModel):
    items: List[WishlistItemResponse]
    total: int
