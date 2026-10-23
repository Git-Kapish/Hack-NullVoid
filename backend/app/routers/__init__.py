from app.routers.auth import router as auth_router
from app.routers.catalog import router as catalog_router
from app.routers.categories import router as categories_router
from app.routers.cart import router as cart_router
from app.routers.wishlist import router as wishlist_router
from app.routers.orders import router as orders_router
from app.routers.support import router as support_router
from app.routers.dashboard import router as dashboard_router
from app.routers.admin_products import router as admin_products_router
from app.routers.ai import router as ai_router

__all__ = [
    "auth_router",
    "catalog_router",
    "categories_router",
    "cart_router",
    "wishlist_router",
    "orders_router",
    "support_router",
    "dashboard_router",
    "admin_products_router",
    "ai_router",
]
