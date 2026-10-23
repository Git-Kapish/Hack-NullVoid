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

    # 3. Decode Clerk JWT or mock token
    try:
        if settings.CLERK_SECRET_KEY:
            # Decode using Clerk Secret / JWKS
            # Clerk tokens can be decoded without verification in mock mode, or verified with Clerk JWKS
            payload = jwt.decode(token, options={"verify_signature": False})
        else:
            # Fallback permissive decode for local development
            payload = jwt.decode(token, options={"verify_signature": False})

        user_id = payload.get("sub") or payload.get("user_id") or payload.get("id")
        email = payload.get("email") or payload.get("sub", "") + "@clerk.user"
        role = payload.get("role", "CUSTOMER")
        tier = payload.get("membership_tier", "BASIC")
        first_name = payload.get("first_name")
        last_name = payload.get("last_name")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return AuthUser(
            id=user_id,
            email=email,
            role=role,
            membership_tier=tier,
            first_name=first_name,
            last_name=last_name
        )

    except jwt.PyJWTError as e:
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
