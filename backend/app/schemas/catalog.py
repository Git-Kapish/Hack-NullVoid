from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    parentId: Optional[int] = None
    children: Optional[List["CategoryResponse"]] = []


class ProductSpecSchema(BaseModel):
    key: str
    value: str


class ProductImageSchema(BaseModel):
    url: str
    altText: Optional[str] = None
    sortOrder: int = 0


class ProductListItem(BaseModel):
    id: int
    sku: str
    name: str
    description: str
    brand: str
    categoryId: int
    categoryName: Optional[str] = None
    price: float
    currency: str = "USD"
    rating: float = 0.0
    availability: str = Field("IN_STOCK", description="IN_STOCK, LOW_STOCK, OUT_OF_STOCK")
    images: List[ProductImageSchema] = []


class ProductDetailResponse(ProductListItem):
    specs: List[ProductSpecSchema] = []
    totalInventory: int = 0


class ProductFilterQuery(BaseModel):
    query: Optional[str] = Field(None, description="Search term in name, description, brand")
    category: Optional[str] = Field(None, description="Category name or slug")
    brand: Optional[str] = Field(None, description="Brand name")
    minPrice: Optional[float] = Field(None, ge=0)
    maxPrice: Optional[float] = Field(None, ge=0)
    sort: Optional[str] = Field("price_asc", description="price_asc, price_desc, rating_desc, newest")
    page: int = Field(0, ge=0)
    size: int = Field(12, ge=1, le=50)

    @model_validator(mode="after")
    def validate_price_range(self):
        if self.minPrice is not None and self.maxPrice is not None:
            if self.minPrice > self.maxPrice:
                raise ValueError("minPrice cannot be greater than maxPrice")
        return self


class ProductCompareRequest(BaseModel):
    productIds: List[int] = Field(..., min_length=2, max_length=4, description="2 to 4 product IDs to compare")


class ProductCompareResponse(BaseModel):
    products: List[ProductDetailResponse]
    comparisonMatrix: List[dict]  # aligned attributes across all compared products
