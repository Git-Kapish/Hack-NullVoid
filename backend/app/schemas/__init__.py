from app.schemas.common import ErrorResponse, PaginationParams, PaginatedResponse
from app.schemas.auth import UserProfileResponse, CustomerPreferenceUpdate, ClerkWebhookEvent
from app.schemas.catalog import (
    CategoryResponse,
    ProductSpecSchema,
    ProductImageSchema,
    ProductListItem,
    ProductDetailResponse,
    ProductFilterQuery,
    ProductCompareRequest,
    ProductCompareResponse,
)
from app.schemas.cart import (
    CartItemResponse,
    CartResponse,
    AddToCartRequest,
    UpdateCartItemRequest,
)
from app.schemas.orders import (
    OrderItemResponse,
    ShipmentEventResponse,
    OrderResponse,
    CheckoutRequest,
)
from app.schemas.wishlist import WishlistItemResponse, WishlistResponse
from app.schemas.support import CreateTicketRequest, SupportTicketResponse
from app.schemas.dashboard import DashboardStatsResponse, LowStockAlert, TopSellingProduct
from app.schemas.ai import (
    RecommendationRequest,
    RecommendationResponse,
    SmartSearchRequest,
    SmartSearchResponse,
    ChatRequest,
    ChatResponse,
)

__all__ = [
    "ErrorResponse",
    "PaginationParams",
    "PaginatedResponse",
    "UserProfileResponse",
    "CustomerPreferenceUpdate",
    "ClerkWebhookEvent",
    "CategoryResponse",
    "ProductSpecSchema",
    "ProductImageSchema",
    "ProductListItem",
    "ProductDetailResponse",
    "ProductFilterQuery",
    "ProductCompareRequest",
    "ProductCompareResponse",
    "CartItemResponse",
    "CartResponse",
    "AddToCartRequest",
    "UpdateCartItemRequest",
    "OrderItemResponse",
    "ShipmentEventResponse",
    "OrderResponse",
    "CheckoutRequest",
    "WishlistItemResponse",
    "WishlistResponse",
    "CreateTicketRequest",
    "SupportTicketResponse",
    "DashboardStatsResponse",
    "LowStockAlert",
    "TopSellingProduct",
    "RecommendationRequest",
    "RecommendationResponse",
    "SmartSearchRequest",
    "SmartSearchResponse",
    "ChatRequest",
    "ChatResponse",
]
