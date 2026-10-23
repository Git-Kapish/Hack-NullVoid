from fastapi import APIRouter, Depends
from app.core.clerk_auth import require_role, AuthUser
from app.schemas.dashboard import DashboardStatsResponse
from app.services.dashboard_service import get_dashboard_service, DashboardService

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_analytics(
    admin_user: AuthUser = Depends(require_role("ADMIN")),
    service: DashboardService = Depends(get_dashboard_service),
):
    """
    Retrieve comprehensive e-commerce dashboard analytics:
    - Total revenue and order status distribution
    - Customer breakdown by membership tier (BASIC, PRIME, PREMIUM)
    - Real-time low stock inventory alerts
    - Top 5 selling products by units sold
    """
    return await service.get_stats()
