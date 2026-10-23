import logging
from typing import Optional, Any
try:
    from prisma import Prisma
except (ImportError, AttributeError):
    Prisma = None

logger = logging.getLogger(__name__)

prisma_client: Optional[Any] = None


def get_prisma():
    global prisma_client
    if prisma_client is None and Prisma is not None:
        try:
            prisma_client = Prisma()
        except Exception as e:
            logger.warning(f"Could not instantiate Prisma client: {e}")
    return prisma_client


async def connect_db() -> None:
    db = get_prisma()
    if db and not db.is_connected():
        try:
            await db.connect()
            logger.info("Successfully connected to Prisma database")
        except Exception as e:
            logger.warning(f"Prisma connection notice (database might be initializing): {e}")


async def disconnect_db() -> None:
    global prisma_client
    if prisma_client and prisma_client.is_connected():
        await prisma_client.disconnect()
        logger.info("Disconnected from Prisma database")
