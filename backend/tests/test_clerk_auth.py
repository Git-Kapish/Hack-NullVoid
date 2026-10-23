from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_auth_me_unauthorized_without_token():
    """Unauthenticated request to /auth/me returns 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert data["code"] == "UNAUTHORIZED"
    assert "requestId" in data


def test_auth_me_with_mock_header():
    """Request with mock user header succeeds in development."""
    headers = {
        "X-Mock-User-Id": "user_test_clerk_123",
        "X-Mock-User-Role": "CUSTOMER",
        "X-Mock-User-Tier": "PRIME",
        "X-Mock-User-Email": "tester@shopsmart.ai",
    }
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "user_test_clerk_123"
    assert data["role"] == "CUSTOMER"
    assert data["membershipTier"] == "PRIME"


def test_admin_route_forbidden_for_customer():
    """Customer role accessing admin endpoint returns 403 FORBIDDEN."""
    customer_headers = {
        "X-Mock-User-Id": "user_customer_456",
        "X-Mock-User-Role": "CUSTOMER",
    }
    response = client.get("/api/v1/admin/dashboard/stats", headers=customer_headers)
    assert response.status_code == 403
    data = response.json()
    assert data["code"] == "FORBIDDEN"


def test_admin_route_allowed_for_admin():
    """Admin role accessing admin endpoint succeeds."""
    admin_headers = {
        "X-Mock-User-Id": "user_admin_789",
        "X-Mock-User-Role": "ADMIN",
    }
    response = client.get("/api/v1/admin/dashboard/stats", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "totalRevenue" in data
    assert "ordersByStatus" in data
    assert "tierDistribution" in data


def test_auth_login_endpoint_issues_valid_jwt():
    """POST /auth/login issues a valid 3-part JWT and user profile."""
    res = client.post("/api/v1/auth/login", json={"email": "david.basic@example.com", "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    token = data["access_token"]
    assert token.count(".") == 2, "Token must be a valid 3-part JWT"
    assert data["user"]["email"] == "david.basic@example.com"
    assert data["user"]["role"] == "CUSTOMER"

    # Use the issued JWT to authenticate against GET /auth/me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "david.basic@example.com"


def test_auth_me_with_non_segmented_mock_token_succeeds_without_error():
    """Non-segmented mock token does not crash with Not enough segments in dev mode."""
    res = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer mock-jwt-token-1740000000"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "CUSTOMER"

