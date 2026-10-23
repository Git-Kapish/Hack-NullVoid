from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_cart_endpoints_require_authentication():
    res = client.get("/api/v1/cart")
    assert res.status_code == 401

    res = client.post("/api/v1/cart/items", json={"productId": 1, "quantity": 1})
    assert res.status_code == 401


def test_orders_endpoints_require_authentication():
    res = client.get("/api/v1/orders")
    assert res.status_code == 401

    res = client.post("/api/v1/orders/checkout", json={})
    assert res.status_code == 401


def test_wishlist_endpoints_require_authentication():
    res = client.get("/api/v1/wishlist")
    assert res.status_code == 401


def test_support_endpoints_require_authentication():
    res = client.get("/api/v1/support/tickets")
    assert res.status_code == 401

    res = client.post("/api/v1/support/tickets", json={"subject": "Help needed", "description": "Need assistance with item"})
    assert res.status_code == 401


def test_authenticated_cart_access():
    headers = {"X-Mock-User-Id": "user_buyer_1"}
    res = client.get("/api/v1/cart", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["userId"] == "user_buyer_1"
    assert "items" in data
    assert "subtotal" in data


def test_authenticated_orders_access():
    headers = {"X-Mock-User-Id": "user_buyer_2"}
    res = client.get("/api/v1/orders", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
