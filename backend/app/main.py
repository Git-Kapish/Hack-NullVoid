from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
import inngest.fast_api

from app.core.config import settings
from app.core.errors import register_error_handlers
from app.core.middleware import RequestIdMiddleware
from app.core.database import connect_db, disconnect_db
from app.inngest_client import inngest_client, inngest_functions
from app.routers import (
    auth_router,
    catalog_router,
    categories_router,
    cart_router,
    wishlist_router,
    orders_router,
    support_router,
    dashboard_router,
    admin_products_router,
    ai_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database connection
    await connect_db()
    yield
    # Shutdown: Cleanly disconnect database
    await disconnect_db()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Register Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)
app.add_middleware(RequestIdMiddleware)

# Register Exception Handlers
register_error_handlers(app)

# Serve Inngest Functions Endpoint at /api/inngest
inngest.fast_api.serve(app, inngest_client, inngest_functions)

# Mount API Routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(catalog_router, prefix=settings.API_V1_PREFIX)
app.include_router(categories_router, prefix=settings.API_V1_PREFIX)
app.include_router(cart_router, prefix=settings.API_V1_PREFIX)
app.include_router(wishlist_router, prefix=settings.API_V1_PREFIX)
app.include_router(orders_router, prefix=settings.API_V1_PREFIX)
app.include_router(support_router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_products_router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_router, prefix=settings.API_V1_PREFIX)


@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """Health check endpoint confirming API service readiness."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "auth": "clerk",
        "database": "prisma",
        "workflows": "inngest",
        "ai": "gemini",
    }


@app.get("/", include_in_schema=False)
def root_redirect():
    return {"message": "Welcome to ShopSmart AI API. Visit /docs for Swagger UI documentation."}
