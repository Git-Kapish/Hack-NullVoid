import logging
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from app.core.database import get_prisma
from app.services.cart_service import get_cart_service
from app.inngest_client.client import inngest_client
from app.schemas.orders import OrderResponse, OrderItemResponse, ShipmentEventResponse
import inngest

logger = logging.getLogger(__name__)


class OrderService:
    async def checkout(self, user_id: str) -> OrderResponse:
        """Convert current cart to an Order, record items, emit Inngest event, and clear cart."""
        db = get_prisma()
        cart_service = get_cart_service()
        cart = await cart_service.get_or_create_cart(user_id)

        if not cart.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot checkout with an empty cart",
            )

        # Create Order and OrderItems
        order = await db.order.create(
            data={
                "userId": user_id,
                "status": "PENDING",
                "totalAmount": cart.subtotal,
                "items": {
                    "create": [
                        {
                            "productId": item.productId,
                            "productName": item.product.name,
                            "unitPrice": item.product.price,
                            "quantity": item.quantity,
                        }
                        for item in cart.items
                    ]
                },
                "shipmentEvents": {
                    "create": [
                        {
                            "status": "PLACED",
                            "location": "Online Order Received",
                        }
                    ]
                },
            },
            include={
                "items": True,
                "shipmentEvents": True,
            },
        )

        # Clear the cart after successful checkout
        await cart_service.clear_cart(user_id)

        # Trigger Inngest workflow asynchronously
        try:
            await inngest_client.send(
                inngest.Event(
                    name="order.created",
                    data={"orderId": order.id, "userId": user_id, "amount": cart.subtotal},
                )
            )
        except Exception as e:
            logger.warning(f"Inngest event dispatch failed: {e}")

        return self._format_order(order)

    async def list_orders(self, user_id: str) -> List[OrderResponse]:
        db = get_prisma()
        if not db.is_connected():
            return []
        orders = await db.order.find_many(
            where={"userId": user_id},
            include={"items": True, "shipmentEvents": True},
            order={"createdAt": "desc"},
        )
        return [self._format_order(o) for o in orders]

    async def get_order_by_id(self, user_id: str, order_id: int, is_admin: bool = False) -> OrderResponse:
        db = get_prisma()
        if not db.is_connected():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        where: Dict[str, Any] = {"id": order_id}
        if not is_admin:
            where["userId"] = user_id  # Strict ownership check

        order = await db.order.find_first(
            where=where,
            include={"items": True, "shipmentEvents": True},
        )
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        return self._format_order(order)

    def _format_order(self, order) -> OrderResponse:
        return OrderResponse(
            id=order.id,
            userId=order.userId,
            status=order.status,
            totalAmount=float(order.totalAmount),
            createdAt=order.createdAt,
            items=[
                OrderItemResponse(
                    id=i.id,
                    productId=i.productId,
                    productName=i.productName,
                    unitPrice=float(i.unitPrice),
                    quantity=i.quantity,
                    subtotal=float(i.unitPrice) * i.quantity,
                )
                for i in (order.items or [])
            ],
            shipmentEvents=[
                ShipmentEventResponse(
                    id=s.id,
                    status=s.status,
                    location=s.location,
                    eventTime=s.eventTime,
                )
                for s in (order.shipmentEvents or [])
            ],
        )


_order_service = None


def get_order_service() -> OrderService:
    global _order_service
    if _order_service is None:
        _order_service = OrderService()
    return _order_service
