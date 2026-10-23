from fastapi import APIRouter, Depends
from app.schemas.ai import (
    RecommendationRequest,
    RecommendationResponse,
    SmartSearchRequest,
    SmartSearchResponse,
    ChatRequest,
    ChatResponse,
)
from app.ai.gemini_service import get_gemini_service, GeminiService
from app.services.catalog_service import get_catalog_service, CatalogService
from app.schemas.catalog import ProductFilterQuery

router = APIRouter(prefix="/ai", tags=["Generative AI (Gemini)"])


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    payload: RecommendationRequest,
    gemini: GeminiService = Depends(get_gemini_service),
    catalog_service: CatalogService = Depends(get_catalog_service),
):
    """
    Generate grounded AI recommendations using the Gemini API.
    Extracts intent, queries candidate products from database, and produces tailored explanations.
    """
    # Query-informed candidate retrieval from catalog
    q_lower = (payload.query or "").lower()
    cat = None
    if any(k in q_lower for k in ["laptop", "notebook", "computer", "macbook", "pc"]):
        cat = "laptops"
    elif any(k in q_lower for k in ["headphone", "audio", "earbud", "sound", "speaker", "noise"]):
        cat = "audio"
    elif any(k in q_lower for k in ["watch", "wearable", "fitness", "tracker"]):
        cat = "wearables"
    elif any(k in q_lower for k in ["keyboard", "mouse", "dock", "accessory", "peripherals"]):
        cat = "accessories"

    filter_params = ProductFilterQuery(page=0, size=50, category=cat)
    candidates_result = await catalog_service.list_products(filter_params)

    # Fallback to broader catalog if no candidates found in specific category
    if not candidates_result["items"] and cat:
        fallback_params = ProductFilterQuery(page=0, size=50)
        candidates_result = await catalog_service.list_products(fallback_params)

    candidate_dicts = [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "brand": p.brand,
            "price": p.price,
            "availability": p.availability,
        }
        for p in candidates_result["items"]
    ]

    res = await gemini.recommend_products(
        query=payload.query,
        candidates=candidate_dicts,
        budget=payload.budget,
    )
    return RecommendationResponse(**res)


@router.post("/smart-search", response_model=SmartSearchResponse)
async def smart_search_query_expansion(
    payload: SmartSearchRequest,
    gemini: GeminiService = Depends(get_gemini_service),
):
    """
    Translate natural-language customer queries into structured catalog search filters using Gemini.
    """
    res = await gemini.enhance_search_query(payload.query)
    return SmartSearchResponse(**res)


@router.post("/chat", response_model=ChatResponse)
async def shopping_concierge_chat(
    payload: ChatRequest,
    gemini: GeminiService = Depends(get_gemini_service),
    catalog_service: CatalogService = Depends(get_catalog_service),
):
    """
    Interactive shopping concierge dialogue turn with catalog grounding.
    """
    candidates_result = await catalog_service.list_products(ProductFilterQuery(page=0, size=5))
    catalog_summary = [
        {"id": p.id, "name": p.name, "brand": p.brand, "price": p.price}
        for p in candidates_result["items"]
    ]

    history_dicts = [{"role": m.role, "content": m.content} for m in payload.history]
    res = await gemini.chat_turn(history_dicts, payload.message, catalog_summary)
    return ChatResponse(**res)
