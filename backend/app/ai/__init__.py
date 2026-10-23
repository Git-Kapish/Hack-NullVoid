from app.ai.prompts import (
    SHOPPING_RECOMMENDATION_SYSTEM_PROMPT,
    SMART_SEARCH_SYSTEM_PROMPT,
    PRODUCT_INSIGHTS_SYSTEM_PROMPT,
    SHOPPING_ASSISTANT_CHAT_SYSTEM_PROMPT,
)
from app.ai.gemini_service import GeminiService, get_gemini_service

__all__ = [
    "SHOPPING_RECOMMENDATION_SYSTEM_PROMPT",
    "SMART_SEARCH_SYSTEM_PROMPT",
    "PRODUCT_INSIGHTS_SYSTEM_PROMPT",
    "SHOPPING_ASSISTANT_CHAT_SYSTEM_PROMPT",
    "GeminiService",
    "get_gemini_service",
]
