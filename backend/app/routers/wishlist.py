from fastapi import APIRouter, Depends, status, HTTPException
from app.core.clerk_auth import get_current_user, AuthUser
from app.core.database import get_prisma
from app.schemas.wishlist import WishlistResponse, WishlistItemResponse
from app.schemas.catalog import ProductListItem, ProductImageSchema
from app.services.catalog_service import derive_availability

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=WishlistResponse)
async def get_wishlist(current_user: AuthUser = Depends(get_current_user)):
    """Retrieve saved wishlist items for the authenticated user."""
    db = get_prisma()
    if not db.is_connected():
        return WishlistResponse(items=[], total=0)

    items = await db.wishlistitem.find_many(
        where={"userId": current_user.id},
        include={"product": {"include": {"images": True, "category": True, "inventory": True}}},
        order={"createdAt": "desc"},
    )

    result = []
    for w in items:
        prod = w.product
        total_inv = sum(inv.quantity for inv in (prod.inventory or []))
        prod_item = ProductListItem(
            id=prod.id,
            sku=prod.sku,
            name=prod.name,
            description=prod.description,
            brand=prod.brand,
            categoryId=prod.categoryId,
            categoryName=prod.category.name if prod.category else None,
            price=float(prod.price),
            currency=prod.currency,
            rating=float(prod.rating),
            availability=derive_availability(total_inv),
            images=[
                ProductImageSchema(url=img.url, altText=img.altText, sortOrder=img.sortOrder)
                for img in (prod.images or [])
            ],
        )
        result.append(
            WishlistItemResponse(
                productId=w.productId,
                createdAt=w.createdAt,
                product=prod_item,
            )
        )

    return WishlistResponse(items=result, total=len(result))


@router.put("/{product_id}", status_code=status.HTTP_200_OK)
async def add_to_wishlist(
    product_id: int,
    current_user: AuthUser = Depends(get_current_user),
):
    """Add a product to wishlist (idempotent)."""
    db = get_prisma()
    if not db.is_connected():
        raise HTTPException(status_code=503, detail="Database unavailable")

    # Verify user exists in database
    user = await db.user.find_unique(where={"id": current_user.id})
    if not user:
        await db.user.create(data={"id": current_user.id, "email": current_user.email})

    product = await db.product.find_unique(where={"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.wishlistitem.upsert(
        where={"userId_productId": {"userId": current_user.id, "productId": product_id}},
        data={
            "create": {"userId": current_user.id, "productId": product_id},
            "update": {},
        },
    )
    return {"status": "saved", "productId": product_id}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def remove_from_wishlist(
    product_id: int,
    current_user: AuthUser = Depends(get_current_user),
):
    """Remove a product from customer's wishlist."""
    db = get_prisma()
    if db.is_connected():
        await db.wishlistitem.delete(
            where={"userId_productId": {"userId": current_user.id, "productId": product_id}}
        )
    return {"status": "removed", "productId": product_id}
