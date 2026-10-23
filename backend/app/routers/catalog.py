from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.catalog import (
    ProductListItem,
    ProductDetailResponse,
    ProductFilterQuery,
    ProductCompareRequest,
    ProductCompareResponse,
)
from app.schemas.common import PaginatedResponse
from app.services.catalog_service import get_catalog_service, CatalogService

router = APIRouter(prefix="/products", tags=["Catalog"])


@router.get("", response_model=PaginatedResponse[ProductListItem])
async def list_products(
    filters: ProductFilterQuery = Depends(),
    service: CatalogService = Depends(get_catalog_service),
):
    """Retrieve catalog products with server-side filtering, sorting, and pagination."""
    result = await service.list_products(filters)
    return PaginatedResponse[ProductListItem](**result)


@router.get("/{product_id}", response_model=ProductDetailResponse)
async def get_product(
    product_id: int,
    service: CatalogService = Depends(get_catalog_service),
):
    """Retrieve full product details, specifications, images, and derived availability."""
    product = await service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product #{product_id} not found",
        )
    return product


@router.post("/compare", response_model=ProductCompareResponse)
async def compare_products(
    payload: ProductCompareRequest,
    service: CatalogService = Depends(get_catalog_service),
):
    """Compare 2 to 4 products side by side, returning an aligned specification matrix."""
    return await service.compare_products(payload.productIds)
