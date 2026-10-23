import logging
from typing import Optional
from fastapi import HTTPException, status
from app.core.database import get_prisma
from app.schemas.cart import CartResponse, CartItemResponse
from app.schemas.catalog import ProductListItem, ProductImageSchema
from app.services.catalog_service import derive_availability

logger = logging.getLogger(__name__)


class CartService:
    async def get_or_create_cart(self, user_id: str) -> CartResponse:
        db = get_prisma()
        if not db.is_connected():
            return CartResponse(id=0, userId=user_id, items=[], subtotal=0.0, itemCount=0)

        # Ensure User exists in local DB
        user = await db.user.find_unique(where={"id": user_id})
        if not user:
            await db.user.create(data={"id": user_id, "email": f"{user_id}@shopsmart.ai"})

        cart = await db.cart.find_unique(
            where={"userId": user_id},
            include={
                "items": {
                    "include": {
                        "product": {
                            "include": {"images": True, "category": True, "inventory": True}
                        }
                    }
                }
            },
        )
        if not cart:
            cart = await db.cart.create(
                data={"userId": user_id},
                include={
                    "items": {
                        "include": {
                            "product": {
                                "include": {"images": True, "category": True, "inventory": True}
                            }
                        }
                    }
                },
            )

        items_resp = []
        subtotal = 0.0
        total_count = 0

        for item in cart.items:
            prod = item.product
            price = float(prod.price)
            item_total = price * item.quantity
            subtotal += item_total
            total_count += item.quantity

            total_inv = sum(inv.quantity for inv in (prod.inventory or []))
            prod_item = ProductListItem(
                id=prod.id,
                sku=prod.sku,
                name=prod.name,
                description=prod.description,
                brand=prod.brand,
                categoryId=prod.categoryId,
                categoryName=prod.category.name if prod.category else None,
                price=price,
                currency=prod.currency,
                rating=float(prod.rating),
                availability=derive_availability(total_inv),
                images=[
                    ProductImageSchema(url=img.url, altText=img.altText, sortOrder=img.sortOrder)
                    for img in (prod.images or [])
                ],
            )

            items_resp.append(
                CartItemResponse(
                    id=item.id,
                    productId=item.productId,
                    quantity=item.quantity,
                    product=prod_item,
                    itemTotal=item_total,
                )
            )

        return CartResponse(
            id=cart.id,
            userId=cart.userId,
            items=items_resp,
            subtotal=round(subtotal, 2),
            itemCount=total_count,
        )

    async def add_item(self, user_id: str, product_id: int, quantity: int = 1) -> CartResponse:
        db = get_prisma()
        if not db.is_connected():
            raise HTTPException(status_code=503, detail="Database connection unavailable")

        # Verify product & inventory
        product = await db.product.find_unique(
            where={"id": product_id},
            include={"inventory": True}
        )
        if not product or not product.active:
            raise HTTPException(status_code=404, detail="Product not found or inactive")

        available_stock = sum(inv.quantity for inv in (product.inventory or []))
        if available_stock <= 0:
            raise HTTPException(status_code=400, detail="Product is out of stock")

        cart_resp = await self.get_or_create_cart(user_id)

        # Check existing item
        existing_item = await db.cartitem.find_first(
            where={"cartId": cart_resp.id, "productId": product_id}
        )

        new_qty = quantity
        if existing_item:
            new_qty += existing_item.quantity

        if new_qty > available_stock:
            raise HTTPException(
                status_code=400,
                detail=f"Requested quantity ({new_qty}) exceeds available stock ({available_stock})"
            )

        if existing_item:
            await db.cartitem.update(
                where={"id": existing_item.id},
                data={"quantity": new_qty}
            )
        else:
            await db.cartitem.create(
                data={"cartId": cart_resp.id, "productId": product_id, "quantity": quantity}
            )

        return await self.get_or_create_cart(user_id)

    async def update_item_quantity(self, user_id: str, item_id: int, quantity: int) -> CartResponse:
        db = get_prisma()
        cart_resp = await self.get_or_create_cart(user_id)

        # Scoped to current user's cart
        item = await db.cartitem.find_first(
            where={"id": item_id, "cartId": cart_resp.id},
            include={"product": {"include": {"inventory": True}}}
        )
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        available_stock = sum(inv.quantity for inv in (item.product.inventory or []))
        if quantity > available_stock:
            raise HTTPException(
                status_code=400,
                detail=f"Quantity exceeds available stock ({available_stock})"
            )

        await db.cartitem.update(
            where={"id": item_id},
            data={"quantity": quantity}
        )
        return await self.get_or_create_cart(user_id)

    async def remove_item(self, user_id: str, item_id: int) -> CartResponse:
        db = get_prisma()
        cart_resp = await self.get_or_create_cart(user_id)

        item = await db.cartitem.find_first(
            where={"id": item_id, "cartId": cart_resp.id}
        )
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        await db.cartitem.delete(where={"id": item_id})
        return await self.get_or_create_cart(user_id)

    async def clear_cart(self, user_id: str) -> None:
        db = get_prisma()
        cart_resp = await self.get_or_create_cart(user_id)
        await db.cartitem.delete_many(where={"cartId": cart_resp.id})


_cart_service = None


def get_cart_service() -> CartService:
    global _cart_service
    if _cart_service is None:
        _cart_service = CartService()
    return _cart_service
