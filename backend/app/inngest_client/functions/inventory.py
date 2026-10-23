import logging
import inngest
from app.inngest_client.client import inngest_client
from app.core.database import get_prisma

logger = logging.getLogger(__name__)


@inngest_client.create_function(
    fn_id="alert-low-stock",
    trigger=inngest.TriggerEvent(event="inventory.low_stock")
)
async def alert_low_stock(ctx: inngest.Context, step: inngest.Step) -> dict:
    product_id = ctx.event.data.get("productId")
    quantity = ctx.event.data.get("quantity")

    logger.warning(f"Inngest Alert: Product {product_id} is running low on stock! Current quantity: {quantity}")
    return {"productId": product_id, "alertSent": True}
