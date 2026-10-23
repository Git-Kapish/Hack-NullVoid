from fastapi import APIRouter, Depends, status
from app.core.clerk_auth import get_current_user, AuthUser
from app.schemas.cart import CartResponse, AddToCartRequest, UpdateCartItemRequest
from app.services.cart_service import get_cart_service, CartService

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])


@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: AuthUser = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
):
    """Retrieve the authenticated customer's cart, items, and calculated totals."""
    return await service.get_or_create_cart(current_user.id)


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
async def add_item_to_cart(
    payload: AddToCartRequest,
    current_user: AuthUser = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
):
    """Add a product to cart with inventory stock verification."""
    return await service.add_item(current_user.id, payload.productId, payload.quantity)


@router.patch("/items/{item_id}", response_model=CartResponse)
async def update_cart_item(
    item_id: int,
    payload: UpdateCartItemRequest,
    current_user: AuthUser = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
):
    """Update item quantity in current user's cart."""
    return await service.update_item_quantity(current_user.id, item_id, payload.quantity)


@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_cart_item(
    item_id: int,
    current_user: AuthUser = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
):
    """Remove an item from current user's cart."""
    return await service.remove_item(current_user.id, item_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: AuthUser = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
):
    """Empty all items from customer's cart."""
    await service.clear_cart(current_user.id)
