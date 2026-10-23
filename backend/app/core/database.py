import logging
from typing import Optional
from prisma import Prisma

logger = logging.getLogger(__name__)

prisma_client: Optional[Prisma] = None


def get_prisma() -> Prisma:
    global prisma_client
    if prisma_client is None:
        prisma_client = Prisma()
    return prisma_client


async def connect_db() -> None:
    db = get_prisma()
    if not db.is_connected():
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
