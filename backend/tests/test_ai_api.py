from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_recommendations_endpoint():
    payload = {
        "query": "I need a fast laptop for programming under $1200",
        "budget": 1200.0,
    }
    response = client.post("/api/v1/ai/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "interpretedRequirement" in data
    assert data["budget"] == 1200.0
    assert "recommendations" in data


def test_ai_smart_search_endpoint():
    payload = {"query": "lightweight laptop 1000"}
    response = client.post("/api/v1/ai/smart-search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "expandedQuery" in data
    assert "extractedKeywords" in data


def test_ai_chat_concierge_endpoint():
    payload = {
        "message": "Which laptop is best for coding?",
        "history": [],
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "suggestedProductIds" in data
