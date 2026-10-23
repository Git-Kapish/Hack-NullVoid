from typing import List
from fastapi import APIRouter
from app.core.database import get_prisma
from app.schemas.catalog import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories():
    """Retrieve full category hierarchy (top-level categories with nested subcategories)."""
    db = get_prisma()
    if not db.is_connected():
        return []

    # Query top-level categories with their children
    categories = await db.category.find_many(
        where={"parentId": None},
        include={"children": {"include": {"children": True}}},
    )

    def map_cat(c):
        return CategoryResponse(
            id=c.id,
            name=c.name,
            slug=c.slug,
            parentId=c.parentId,
            children=[map_cat(child) for child in (c.children or [])],
        )

    return [map_cat(cat) for cat in categories]
