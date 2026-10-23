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
    # Fetch active candidate products from database
    filter_params = ProductFilterQuery(page=0, size=20)
    candidates_result = await catalog_service.list_products(filter_params)
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
