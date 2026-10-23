import logging
from typing import Dict, Any
from app.core.database import get_prisma
from app.schemas.dashboard import (
    DashboardStatsResponse,
    TierDistribution,
    LowStockAlert,
    TopSellingProduct,
)

logger = logging.getLogger(__name__)


class DashboardService:
    async def get_stats(self) -> DashboardStatsResponse:
        db = get_prisma()
        if not db.is_connected():
            return DashboardStatsResponse(
                totalRevenue=0.0,
                totalOrders=0,
                ordersByStatus={},
                customerCount=0,
                tierDistribution=TierDistribution(),
                lowStockAlerts=[],
                topSellingProducts=[],
            )

        # 1. Orders and Revenue
        orders = await db.order.find_many(include={"items": True})
        total_revenue = sum(float(o.totalAmount) for o in orders if o.status != "CANCELLED")
        total_orders = len(orders)

        orders_by_status: Dict[str, int] = {}
        for o in orders:
            orders_by_status[o.status] = orders_by_status.get(o.status, 0) + 1

        # 2. Customers & Tier Distribution
        users = await db.user.find_many()
        customer_count = len(users)

        tier_dist = TierDistribution(
            basic=sum(1 for u in users if u.membershipTier == "BASIC"),
            prime=sum(1 for u in users if u.membershipTier == "PRIME"),
            premium=sum(1 for u in users if u.membershipTier == "PREMIUM"),
        )

        # 3. Low stock alerts (inventory quantity < 5)
        low_stock_rows = await db.inventory.find_many(
            where={"quantity": {"lt": 5}},
            include={"product": True, "warehouse": True},
        )
        low_stock_alerts = [
            LowStockAlert(
                productId=inv.productId,
                productName=inv.product.name if inv.product else f"Product #{inv.productId}",
                sku=inv.product.sku if inv.product else "",
                warehouseName=inv.warehouse.name if inv.warehouse else "Main",
                quantity=inv.quantity,
            )
            for inv in low_stock_rows
        ]

        # 4. Top selling products
        order_items = await db.orderitem.find_many()
        product_sales: Dict[int, Dict[str, Any]] = {}
        for item in order_items:
            pid = item.productId
            if pid not in product_sales:
                product_sales[pid] = {
                    "productName": item.productName,
                    "unitsSold": 0,
                    "revenueGenerated": 0.0,
                }
            product_sales[pid]["unitsSold"] += item.quantity
            product_sales[pid]["revenueGenerated"] += float(item.unitPrice) * item.quantity

        sorted_products = sorted(
            product_sales.items(),
            key=lambda x: x[1]["unitsSold"],
            reverse=True,
        )[:5]

        top_selling = [
            TopSellingProduct(
                productId=pid,
                productName=info["productName"],
                unitsSold=info["unitsSold"],
                revenueGenerated=round(info["revenueGenerated"], 2),
            )
            for pid, info in sorted_products
        ]

        return DashboardStatsResponse(
            totalRevenue=round(total_revenue, 2),
            totalOrders=total_orders,
            ordersByStatus=orders_by_status,
            customerCount=customer_count,
            tierDistribution=tier_dist,
            lowStockAlerts=low_stock_alerts,
            topSellingProducts=top_selling,
        )


_dashboard_service = None


def get_dashboard_service() -> DashboardService:
    global _dashboard_service
    if _dashboard_service is None:
        _dashboard_service = DashboardService()
    return _dashboard_service
