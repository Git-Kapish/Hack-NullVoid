import logging
from typing import Optional, Dict, Any, Callable
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.core.config import settings

logger = logging.getLogger(__name__)
security_scheme = HTTPBearer(auto_error=False)


class AuthUser:
    def __init__(self, id: str, email: str, role: str = "CUSTOMER", membership_tier: str = "BASIC", first_name: Optional[str] = None, last_name: Optional[str] = None):
        self.id = id
        self.email = email
        self.role = role
        self.membership_tier = membership_tier
        self.first_name = first_name
        self.last_name = last_name


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> AuthUser:
    """
    Authenticate request via Clerk JWT or local mock headers if CLERK_MOCK_AUTH is enabled.
    """
    # 1. Check for mock dev header when mock auth is enabled
    mock_user_id = request.headers.get("X-Mock-User-Id")
    if settings.CLERK_MOCK_AUTH and mock_user_id:
        mock_role = request.headers.get("X-Mock-User-Role", "CUSTOMER")
        mock_email = request.headers.get("X-Mock-User-Email", f"{mock_user_id}@shopsmart.ai")
        mock_tier = request.headers.get("X-Mock-User-Tier", "BASIC")
        return AuthUser(
            id=mock_user_id,
            email=mock_email,
            role=mock_role,
            membership_tier=mock_tier,
            first_name="Mock",
            last_name="User"
        )

    # 2. Extract Bearer token
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # 3. Decode Clerk JWT, local JWT, or mock token
    try:
        # Check if token is a valid 3-part JWT
        if token and token.count(".") == 2:
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get("sub") or payload.get("user_id") or payload.get("id")
            email = payload.get("email") or (payload.get("sub", "") + "@clerk.user" if payload.get("sub") else "user@shopsmart.ai")
            role = payload.get("role", "CUSTOMER")
            tier = payload.get("membership_tier") or payload.get("membershipTier", "BASIC")
            first_name = payload.get("first_name") or payload.get("firstName")
            last_name = payload.get("last_name") or payload.get("lastName")

            if user_id:
                return AuthUser(
                    id=user_id,
                    email=email,
                    role=role,
                    membership_tier=tier,
                    first_name=first_name,
                    last_name=last_name
                )
        elif not settings.CLERK_MOCK_AUTH:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format: expected 3-part JWT",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fallback for mock dev tokens when CLERK_MOCK_AUTH is enabled
        if settings.CLERK_MOCK_AUTH:
            token_lower = (token or "").lower()
            if "admin" in token_lower:
                return AuthUser(
                    id="user_admin_001",
                    email="admin@shopsmart.ai",
                    role="ADMIN",
                    membership_tier="PREMIUM",
                    first_name="Alex",
                    last_name="Vance",
                )
            elif "prime" in token_lower or "sarah" in token_lower:
                return AuthUser(
                    id="user_prime_002",
                    email="sarah.prime@example.com",
                    role="CUSTOMER",
                    membership_tier="PRIME",
                    first_name="Sarah",
                    last_name="Connor",
                )
            elif "premium" in token_lower or "elena" in token_lower:
                return AuthUser(
                    id="user_premium_003",
                    email="elena.premium@example.com",
                    role="CUSTOMER",
                    membership_tier="PREMIUM",
                    first_name="Elena",
                    last_name="Rostova",
                )
            else:
                return AuthUser(
                    id="user_basic_004",
                    email="david.basic@example.com",
                    role="CUSTOMER",
                    membership_tier="BASIC",
                    first_name="David",
                    last_name="Kim",
                )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except jwt.PyJWTError as e:
        if settings.CLERK_MOCK_AUTH:
            logger.debug(f"Clerk token decode failed in mock mode ({e}); defaulting to mock customer")
            return AuthUser(
                id="user_basic_004",
                email="david.basic@example.com",
                role="CUSTOMER",
                membership_tier="BASIC",
                first_name="David",
                last_name="Kim"
            )
        logger.warning(f"Clerk token decode failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[AuthUser]:
    try:
        return await get_current_user(request, credentials)
    except HTTPException:
        return None


def require_role(role: str) -> Callable:
    async def role_checker(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires {role} permissions",
            )
        return current_user
    return role_checker
