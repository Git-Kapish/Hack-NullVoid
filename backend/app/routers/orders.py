from typing import List
from fastapi import APIRouter, Depends, status
from app.core.clerk_auth import get_current_user, AuthUser
from app.schemas.orders import OrderResponse, CheckoutRequest
from app.services.order_service import get_order_service, OrderService

router = APIRouter(prefix="/orders", tags=["Orders & Tracking"])


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def checkout(
    payload: CheckoutRequest = CheckoutRequest(),
    current_user: AuthUser = Depends(get_current_user),
    service: OrderService = Depends(get_order_service),
):
    """Convert customer's cart into an Order and trigger Inngest order fulfillment workflow."""
    return await service.checkout(current_user.id)


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    current_user: AuthUser = Depends(get_current_user),
    service: OrderService = Depends(get_order_service),
):
    """List authenticated customer's past orders."""
    return await service.list_orders(current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_detail(
    order_id: int,
    current_user: AuthUser = Depends(get_current_user),
    service: OrderService = Depends(get_order_service),
):
    """Retrieve order details with full shipment tracking timeline (ownership verified)."""
    is_admin = current_user.role == "ADMIN"
    return await service.get_order_by_id(current_user.id, order_id, is_admin=is_admin)
