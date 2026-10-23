from typing import List, Dict
from pydantic import BaseModel
from app.schemas.catalog import ProductListItem
from app.schemas.orders import OrderResponse


class TierDistribution(BaseModel):
    basic: int = 0
    prime: int = 0
    premium: int = 0


class LowStockAlert(BaseModel):
    productId: int
    productName: str
    sku: str
    warehouseName: str
    quantity: int


class TopSellingProduct(BaseModel):
    productId: int
    productName: str
    unitsSold: int
    revenueGenerated: float


class DashboardStatsResponse(BaseModel):
    totalRevenue: float
    totalOrders: int
    ordersByStatus: Dict[str, int]
    customerCount: int
    tierDistribution: TierDistribution
    lowStockAlerts: List[LowStockAlert]
    topSellingProducts: List[TopSellingProduct]
