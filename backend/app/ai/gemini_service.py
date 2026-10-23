import json
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.ai.prompts import (
    SHOPPING_RECOMMENDATION_SYSTEM_PROMPT,
    SMART_SEARCH_SYSTEM_PROMPT,
    PRODUCT_INSIGHTS_SYSTEM_PROMPT,
    SHOPPING_ASSISTANT_CHAT_SYSTEM_PROMPT,
)

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize google-genai client: {e}")

    def _deterministic_recommend(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        budget: Optional[float] = None
    ) -> Dict[str, Any]:
        matched = []
        for item in candidates:
            if budget is None or item.get("price", 0) <= budget:
                matched.append({
                    "productId": item["id"],
                    "productName": item["name"],
                    "reason": f"Matches your search criteria with strong {item.get('brand', '')} build quality and specifications.",
                    "availability": item.get("availability", "IN_STOCK"),
                    "price": float(item.get("price", 0)),
                })
            if len(matched) >= 3:
                break

        return {
            "interpretedRequirement": f"Shopping request for '{query}'" + (f" with budget ${budget:.2f}" if budget else ""),
            "budget": budget,
            "recommendations": matched,
            "clarifyingQuestion": None if matched else "We couldn't find any items matching your budget. Would you like to raise your budget or view similar categories?",
        }

    async def recommend_products(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        budget: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate structured product recommendations grounded strictly in candidate list."""
        if not self.client or settings.USE_FAKE_LLM or not candidates:
            return self._deterministic_recommend(query, candidates, budget)

        try:
            prompt = f"""
Candidate Products:
{json.dumps(candidates, indent=2)}

Customer Query: {query}
Customer Budget: {f"${budget}" if budget else "None specified"}

Return a JSON object conforming to:
{{
  "interpretedRequirement": "string",
  "budget": number or null,
  "recommendations": [
    {{
      "productId": int,
      "productName": "string",
      "reason": "string",
      "availability": "string",
      "price": number
    }}
  ],
  "clarifyingQuestion": "string or null"
}}
"""
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=f"System: {SHOPPING_RECOMMENDATION_SYSTEM_PROMPT}\n{prompt}",
                config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return data
        except Exception as e:
            logger.warning(f"Gemini recommendation failed: {e}. Falling back to deterministic matcher.")
            return self._deterministic_recommend(query, candidates, budget)

    async def enhance_search_query(self, query: str) -> Dict[str, Any]:
        """Expand vague search query into structured search parameters."""
        if not self.client or settings.USE_FAKE_LLM:
            return {
                "expandedQuery": query,
                "detectedCategory": "Laptops" if "laptop" in query.lower() else None,
                "maxPrice": 1000.0 if "1000" in query else None,
                "extractedKeywords": query.split(),
            }

        try:
            prompt = f"Analyze this search query and return JSON: {query}"
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=f"System: {SMART_SEARCH_SYSTEM_PROMPT}\n{prompt}",
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Smart search enhancement error: {e}")
            return {"expandedQuery": query, "detectedCategory": None, "maxPrice": None, "extractedKeywords": query.split()}

    async def generate_product_tags(self, product_name: str) -> List[str]:
        """Auto-generate 3-5 tags for a newly created product."""
        if not self.client or settings.USE_FAKE_LLM:
            return ["trending", "featured", "verified"]
        try:
            prompt = f"Generate 4 short tags (one-word or short phrase) for product: '{product_name}'. Return JSON array of strings."
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception:
            return ["verified", "featured"]

    async def chat_turn(
        self,
        history: List[Dict[str, str]],
        message: str,
        catalog_context: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Interactive shopping concierge dialogue turn."""
        if not self.client or settings.USE_FAKE_LLM:
            return {
                "reply": f"I found several options that could match your interest in '{message}'. Check out our featured items in the catalog!",
                "suggestedProductIds": [p["id"] for p in catalog_context[:2]],
            }

        try:
            context_str = f"Available Catalog Context:\n{json.dumps(catalog_context[:5], indent=2)}"
            chat_prompt = f"{context_str}\n\nCustomer Message: {message}"
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=f"System: {SHOPPING_ASSISTANT_CHAT_SYSTEM_PROMPT}\n{chat_prompt}",
            )
            return {
                "reply": response.text,
                "suggestedProductIds": [p["id"] for p in catalog_context[:2]],
            }
        except Exception as e:
            logger.warning(f"Gemini chat failed: {e}")
            return {
                "reply": "I'm having trouble processing that right now. Please explore our catalog directly!",
                "suggestedProductIds": [],
            }


_gemini_service = None


def get_gemini_service() -> GeminiService:
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
