import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.llm_client import get_llm_client, FakeLLM
from pydantic import BaseModel
from typing import Optional, List


class SampleIntent(BaseModel):
    category: Optional[str] = None
    use_case: Optional[str] = None
    budget_max: Optional[float] = None
    required_features: List[str] = []
    needs_clarification: bool = False
    clarifying_question: Optional[str] = None


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "X-Request-ID" in response.headers


def test_standard_error_envelope_404():
    response = client.get("/api/v1/non-existent-route")
    assert response.status_code == 404
    data = response.json()
    assert data["code"] == "NOT_FOUND"
    assert "message" in data
    assert "requestId" in data


def test_fake_llm_shopping_intent_and_embed():
    llm = FakeLLM()
    SampleIntent.__name__ = "ShoppingIntent"
    intent = llm.extract_structured(
        schema=SampleIntent,
        system_prompt="Extract intent",
        user_prompt="I want a laptop under $1000 for Java development"
    )
    assert intent.category == "Laptops"
    assert intent.budget_max == 1000.0

    embeddings = llm.embed(["test policy text"])
    assert len(embeddings) == 1
    assert len(embeddings[0]) == 768
