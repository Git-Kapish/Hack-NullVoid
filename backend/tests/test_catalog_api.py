from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_products_list_endpoint():
    response = client.get("/api/v1/products?page=0&size=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "size" in data


def test_invalid_price_range_rejected():
    """minPrice > maxPrice must return 422."""
    response = client.get("/api/v1/products?minPrice=1000&maxPrice=500")
    assert response.status_code == 422
    data = response.json()
    assert data["code"] == "VALIDATION_ERROR"
    assert "minPrice" in data["message"]


def test_excessive_page_size_rejected():
    """Page size capped at 50."""
    response = client.get("/api/v1/products?size=100")
    assert response.status_code == 422
    data = response.json()
    assert data["code"] == "VALIDATION_ERROR"


def test_categories_endpoint():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_compare_minimum_two_products():
    """Comparing fewer than 2 products is rejected by validation."""
    response = client.post("/api/v1/products/compare", json={"productIds": [1]})
    assert response.status_code == 422
    data = response.json()
    assert data["code"] == "VALIDATION_ERROR"
