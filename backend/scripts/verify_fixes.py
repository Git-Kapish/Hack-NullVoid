import asyncio
import os
import json
from dotenv import load_dotenv

# Load env variables
load_dotenv(".env")
load_dotenv("backend/.env")

from app.core.database import get_prisma, connect_db, disconnect_db
from app.services.catalog_service import CatalogService
from app.schemas.catalog import ProductFilterQuery
from app.routers.ai import get_recommendations
from app.ai.gemini_service import get_gemini_service
from app.schemas.ai import RecommendationRequest

async def verify_everything():
    print("Connecting to database...")
    await connect_db()
    db = get_prisma()
    
    catalog_service = CatalogService()
    
    print("\n--- 1. Testing Product Catalog Sorting ---")
    sort_orders = ['price-desc', 'price-asc', 'featured', 'rating', 'newest']
    for sort_param in sort_orders:
        filters = ProductFilterQuery(page=1, size=12, sort=sort_param)
        result = await catalog_service.list_products(filters)
        print(f"Sort '{sort_param}': total={result['total']}, count={len(result['items'])}")
        assert len(result['items']) > 0, f"Sorting '{sort_param}' returned 0 items!"
        if sort_param == 'price-desc':
            prices = [item.price for item in result['items']]
            print(f"  Prices (desc): {prices[:4]}...")
            assert prices == sorted(prices, reverse=True), "price-desc is not in descending order!"
        elif sort_param == 'price-asc':
            prices = [item.price for item in result['items']]
            print(f"  Prices (asc): {prices[:4]}...")
            assert prices == sorted(prices), "price-asc is not in ascending order!"

    print("\n--- 2. Testing Category Filtering ---")
    laptop_filters = ProductFilterQuery(category='laptops', page=1, size=12)
    laptop_result = await catalog_service.list_products(laptop_filters)
    print(f"Laptops count: {len(laptop_result['items'])}")
    assert len(laptop_result['items']) >= 5, "Expected at least 5 laptops!"
    for item in laptop_result['items']:
        print(f"  - {item.name}: ${item.price}")

    print("\n--- 3. Testing AI Recommendations with Gemini 3.8 Flash ---")
    gemini_svc = get_gemini_service()
    ai_request = RecommendationRequest(
        query="suggest the laptop under $1000",
        budget=1000.0
    )
    ai_response = await get_recommendations(
        payload=ai_request,
        gemini=gemini_svc,
        catalog_service=catalog_service
    )
    print("AI Interpretation:", ai_response.interpretedRequirement)
    print("AI Recommendations:")
    for rec in ai_response.recommendations:
        print(f"  * {rec.productName} (${rec.price}) - Reason: {rec.reason}")
        assert rec.price <= 1000.0, f"Product {rec.productName} exceeds $1000 budget! (${rec.price})"
        assert any(k in rec.productName.lower() for k in ["laptop", "macbook", "notebook", "aspire", "ideapad", "vivobook", "pavilion", "xps", "thinkpad"]), f"Non-laptop recommended: {rec.productName}"

    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(verify_everything())
