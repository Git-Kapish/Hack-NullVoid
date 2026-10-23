import logging
import inngest
from app.inngest_client.client import inngest_client
from app.core.database import get_prisma
from app.ai.gemini_service import get_gemini_service

logger = logging.getLogger(__name__)


@inngest_client.create_function(
    fn_id="auto-tag-product",
    trigger=inngest.TriggerEvent(event="product.created")
)
async def auto_tag_product(ctx: inngest.Context, step: inngest.Step) -> dict:
    product_id = ctx.event.data.get("productId")
    product_name = ctx.event.data.get("productName", "")

    async def generate_tags():
        gemini = get_gemini_service()
        tags = await gemini.generate_product_tags(product_name)
        return tags

    generated_tags = await step.run("generate-tags", generate_tags)
    logger.info(f"Generated tags for product {product_id}: {generated_tags}")

    return {"productId": product_id, "tags": generated_tags}
