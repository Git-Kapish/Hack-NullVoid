import inngest
from app.core.config import settings

inngest_client = inngest.Inngest(
    app_id=settings.INNGEST_APP_ID,
    is_production=not settings.INNGEST_IS_DEV,
)
