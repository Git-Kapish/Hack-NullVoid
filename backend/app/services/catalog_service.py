import logging
from typing import List, Optional, Dict, Any
from app.core.database import get_prisma
from app.schemas.catalog import (
    ProductListItem,
    ProductDetailResponse,
    ProductSpecSchema,
    ProductImageSchema,
    ProductFilterQuery,
    ProductCompareResponse,
)

logger = logging.getLogger(__name__)


def derive_availability(total_inventory: int) -> str:
    if total_inventory <= 0:
        return "OUT_OF_STOCK"
    elif total_inventory <= 5:
        return "LOW_STOCK"
    return "IN_STOCK"


class CatalogService:
    async def list_products(self, filters: ProductFilterQuery) -> Dict[str, Any]:
        """List products with server-side filters, sorting, and pagination."""
        db = get_prisma()
        if not db.is_connected():
            return {"items": [], "total": 0, "page": filters.page, "size": filters.size, "totalPages": 0}

        where: Dict[str, Any] = {"active": True}

        if filters.query:
            where["OR"] = [
                {"name": {"contains": filters.query, "mode": "insensitive"}},
                {"description": {"contains": filters.query, "mode": "insensitive"}},
                {"brand": {"contains": filters.query, "mode": "insensitive"}},
            ]

        if filters.category and filters.category != "all":
            where["category"] = {
                "is": {
                    "OR": [
                        {"slug": {"equals": filters.category, "mode": "insensitive"}},
                        {"name": {"contains": filters.category, "mode": "insensitive"}},
                    ]
                }
            }

        if filters.brand and filters.brand != "all":
            where["brand"] = {"equals": filters.brand, "mode": "insensitive"}

        price_filter: Dict[str, Any] = {}
        if filters.minPrice is not None:
            price_filter["gte"] = filters.minPrice
        if filters.maxPrice is not None:
            price_filter["lte"] = filters.maxPrice
        if price_filter:
            where["price"] = price_filter

        # Sort order - support both hyphenated (price-desc) and underscored (price_desc) formats
        order_by: Any = {"price": "asc"}
        s = (filters.sort or "featured").lower().replace("-", "_")
        if s in ("price_desc", "pricedesc"):
            order_by = {"price": "desc"}
        elif s in ("price_asc", "priceasc"):
            order_by = {"price": "asc"}
        elif s in ("rating_desc", "rating", "ratingdesc"):
            order_by = {"rating": "desc"}
        elif s in ("newest", "newest_desc"):
            order_by = {"createdAt": "desc"}
        elif s in ("featured", ""):
            order_by = {"rating": "desc"}

        # Execute count and find (support 1-based frontend page index and 0-based index)
        page_idx = max(0, (filters.page - 1) if filters.page >= 1 else filters.page)
        skip = page_idx * filters.size
        take = filters.size

        total = await db.product.count(where=where)
        products = await db.product.find_many(
            where=where,
            include={"category": True, "images": True, "inventory": True},
            order=order_by,
            skip=skip,
            take=take,
        )

        totalPages = (total + filters.size - 1) // filters.size if total > 0 else 1

        items = []
        for p in products:
            total_inv = sum(inv.quantity for inv in (p.inventory or []))
            items.append(
                ProductListItem(
                    id=p.id,
                    sku=p.sku,
                    name=p.name,
                    description=p.description,
                    brand=p.brand,
                    categoryId=p.categoryId,
                    categoryName=p.category.name if p.category else None,
                    price=float(p.price),
                    currency=p.currency,
                    rating=float(p.rating),
                    availability=derive_availability(total_inv),
                    images=[
                        ProductImageSchema(url=img.url, altText=img.altText, sortOrder=img.sortOrder)
                        for img in (p.images or [])
                    ],
                )
            )

        total_pages = (total + filters.size - 1) // filters.size if total > 0 else 0
        return {
            "items": items,
            "total": total,
            "page": filters.page,
            "size": filters.size,
            "totalPages": total_pages,
        }

    async def get_product_by_id(self, product_id: int) -> Optional[ProductDetailResponse]:
        """Fetch detailed product specifications, images, and live inventory."""
        db = get_prisma()
        if not db.is_connected():
            return None

        p = await db.product.find_unique(
            where={"id": product_id},
            include={
                "category": True,
                "specs": True,
                "images": True,
                "inventory": True,
            },
        )
        if not p:
            return None

        total_inv = sum(inv.quantity for inv in (p.inventory or []))
        return ProductDetailResponse(
            id=p.id,
            sku=p.sku,
            name=p.name,
            description=p.description,
            brand=p.brand,
            categoryId=p.categoryId,
            categoryName=p.category.name if p.category else None,
            price=float(p.price),
            currency=p.currency,
            rating=float(p.rating),
            availability=derive_availability(total_inv),
            totalInventory=total_inv,
            images=[
                ProductImageSchema(url=img.url, altText=img.altText, sortOrder=img.sortOrder)
                for img in (p.images or [])
            ],
            specs=[ProductSpecSchema(key=s.key, value=s.value) for s in (p.specs or [])],
        )

    async def compare_products(self, product_ids: List[int]) -> ProductCompareResponse:
        """Generate side-by-side spec comparison matrix for 2 to 4 products."""
        products = []
        for pid in product_ids:
            p = await self.get_product_by_id(pid)
            if p:
                products.append(p)

        all_spec_keys = set()
        for p in products:
            for s in p.specs:
                all_spec_keys.add(s.key)

        matrix = []
        for key in sorted(all_spec_keys):
            row: Dict[str, Any] = {"attribute": key}
            for p in products:
                val = next((s.value for s in p.specs if s.key == key), "N/A")
                row[f"product_{p.id}"] = val
            matrix.append(row)

        return ProductCompareResponse(products=products, comparisonMatrix=matrix)


_catalog_service = None


def get_catalog_service() -> CatalogService:
    global _catalog_service
    if _catalog_service is None:
        _catalog_service = CatalogService()
    return _catalog_service
