import logging
import inngest
from app.inngest_client.client import inngest_client
from app.core.database import get_prisma

logger = logging.getLogger(__name__)


@inngest_client.create_function(
    fn_id="process-order-flow",
    trigger=inngest.TriggerEvent(event="order.created")
)
async def process_order_flow(ctx: inngest.Context, step: inngest.Step) -> dict:
    order_id = ctx.event.data.get("orderId")
    user_id = ctx.event.data.get("userId")

    logger.info(f"Inngest processing order {order_id} for user {user_id}")

    # Step 1: Record packaging milestone
    async def record_packaging():
        db = get_prisma()
        if db.is_connected():
            await db.shipmentevent.create(
                data={
                    "orderId": order_id,
                    "status": "PROCESSING",
                    "location": "Central Fulfillment Center",
                }
            )
            await db.order.update(
                where={"id": order_id},
                data={"status": "PROCESSING"}
            )
        return {"status": "packed"}

    await step.run("record-packaging", record_packaging)

    # Step 2: Simulate dispatch milestone
    async def record_dispatch():
        db = get_prisma()
        if db.is_connected():
            await db.shipmentevent.create(
                data={
                    "orderId": order_id,
                    "status": "SHIPPED",
                    "location": "Regional Sorting Hub",
                }
            )
            await db.order.update(
                where={"id": order_id},
                data={"status": "SHIPPED"}
            )
        return {"status": "shipped"}

    await step.run("record-dispatch", record_dispatch)

    return {"orderId": order_id, "completed": True}
