from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.clerk_auth import require_role, AuthUser
from app.core.database import get_prisma
from app.schemas.catalog import ProductDetailResponse, ProductSpecSchema, ProductImageSchema
from app.services.catalog_service import get_catalog_service, CatalogService
from app.inngest_client.client import inngest_client
import inngest

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])


class CreateProductRequest(BaseModel):
    sku: str
    name: str
    description: str
    brand: str
    categoryId: int
    price: float
    currency: str = "USD"
    specs: List[ProductSpecSchema] = []
    images: List[ProductImageSchema] = []
    initialStock: int = 10
    warehouseId: Optional[int] = None


class UpdateProductRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    active: Optional[bool] = None


class AdjustInventoryRequest(BaseModel):
    warehouseId: int
    quantityDelta: int = Field(..., description="Positive to add stock, negative to remove")


@router.post("", response_model=ProductDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: CreateProductRequest,
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    catalog_service: CatalogService = Depends(get_catalog_service),
):
    """Admin endpoint to create a new catalog product and trigger Inngest AI auto-tagging."""
    db = get_prisma()
    if not db.is_connected():
        raise HTTPException(status_code=503, detail="Database unavailable")

    # Get or create default warehouse
    warehouse_id = payload.warehouseId
    if not warehouse_id:
        warehouse = await db.warehouse.find_first()
        if not warehouse:
            warehouse = await db.warehouse.create(
                data={"name": "Primary Warehouse", "location": "Headquarters"}
            )
        warehouse_id = warehouse.id

    product = await db.product.create(
        data={
            "sku": payload.sku,
            "name": payload.name,
            "description": payload.description,
            "brand": payload.brand,
            "categoryId": payload.categoryId,
            "price": payload.price,
            "currency": payload.currency,
            "specs": {
                "create": [{"key": s.key, "value": s.value} for s in payload.specs]
            },
            "images": {
                "create": [{"url": img.url, "altText": img.altText, "sortOrder": img.sortOrder} for img in payload.images]
            },
            "inventory": {
                "create": [{"warehouseId": warehouse_id, "quantity": payload.initialStock}]
            },
        }
    )

    # Emit Inngest product.created event
    try:
        await inngest_client.send(
            inngest.Event(
                name="product.created",
                data={"productId": product.id, "productName": product.name},
            )
        )
    except Exception as e:
        pass

    detail = await catalog_service.get_product_by_id(product.id)
    return detail


@router.patch("/{product_id}", response_model=ProductDetailResponse)
async def update_product(
    product_id: int,
    payload: UpdateProductRequest,
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    catalog_service: CatalogService = Depends(get_catalog_service),
):
    """Admin endpoint to update product details or toggle active status."""
    db = get_prisma()
    data = payload.model_dump(exclude_unset=True)
    await db.product.update(where={"id": product_id}, data=data)
    return await catalog_service.get_product_by_id(product_id)


@router.post("/{product_id}/inventory")
async def adjust_inventory(
    product_id: int,
    payload: AdjustInventoryRequest,
    admin_user: AuthUser = Depends(require_role("ADMIN")),
):
    """Adjust stock level for a product in a warehouse."""
    db = get_prisma()
    inv = await db.inventory.find_unique(
        where={"productId_warehouseId": {"productId": product_id, "warehouseId": payload.warehouseId}}
    )
    if not inv:
        new_qty = max(0, payload.quantityDelta)
        await db.inventory.create(
            data={"productId": product_id, "warehouseId": payload.warehouseId, "quantity": new_qty}
        )
    else:
        new_qty = max(0, inv.quantity + payload.quantityDelta)
        await db.inventory.update(
            where={"id": inv.id},
            data={"quantity": new_qty}
        )
    return {"productId": product_id, "warehouseId": payload.warehouseId, "newQuantity": new_qty}
