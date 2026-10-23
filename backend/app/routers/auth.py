from datetime import datetime, timezone, timedelta
import uuid
import jwt
from fastapi import APIRouter, Depends, status, HTTPException
from app.core.clerk_auth import get_current_user, AuthUser
from app.core.config import settings
from app.core.database import get_prisma
from app.schemas.auth import (
    UserProfileResponse,
    CustomerPreferenceUpdate,
    ClerkWebhookEvent,
    LoginRequest,
    LoginResponse,
    LoginUserPayload,
)

router = APIRouter(prefix="/auth", tags=["Authentication & User"])

DEMO_PERSONAS_DICT = {
    "admin@shopsmart.ai": {
        "id": "user_admin_001",
        "email": "admin@shopsmart.ai",
        "firstName": "Alex",
        "lastName": "Vance",
        "role": "ADMIN",
        "membershipTier": "PREMIUM",
    },
    "sarah.prime@example.com": {
        "id": "user_prime_002",
        "email": "sarah.prime@example.com",
        "firstName": "Sarah",
        "lastName": "Connor",
        "role": "CUSTOMER",
        "membershipTier": "PRIME",
    },
    "elena.premium@example.com": {
        "id": "user_premium_003",
        "email": "elena.premium@example.com",
        "firstName": "Elena",
        "lastName": "Rostova",
        "role": "CUSTOMER",
        "membershipTier": "PREMIUM",
    },
    "david.basic@example.com": {
        "id": "user_basic_004",
        "email": "david.basic@example.com",
        "firstName": "David",
        "lastName": "Kim",
        "role": "CUSTOMER",
        "membershipTier": "BASIC",
    },
}


@router.post("/login", response_model=LoginResponse)
async def login_user(payload: LoginRequest):
    """Authenticate with credentials or demo persona and issue a valid signed JWT."""
    db = get_prisma()
    email_clean = payload.email.lower().strip()

    user_record = None
    if db.is_connected():
        user_record = await db.user.find_unique(where={"email": email_clean})

    if not user_record and email_clean in DEMO_PERSONAS_DICT:
        demo = DEMO_PERSONAS_DICT[email_clean]
        if db.is_connected():
            user_record = await db.user.upsert(
                where={"id": demo["id"]},
                data={"create": demo, "update": demo}
            )
        else:
            class MockUserObj:
                pass
            user_record = MockUserObj()
            for k, v in demo.items():
                setattr(user_record, k, v)

    if not user_record:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        parts = email_clean.split("@")[0].split(".")
        first_name = parts[0].capitalize()
        last_name = parts[1].capitalize() if len(parts) > 1 else ""
        if db.is_connected():
            user_record = await db.user.create(
                data={
                    "id": user_id,
                    "email": email_clean,
                    "firstName": first_name,
                    "lastName": last_name,
                    "role": "CUSTOMER",
                    "membershipTier": "BASIC",
                }
            )
        else:
            class MockUserObj:
                pass
            user_record = MockUserObj()
            user_record.id = user_id
            user_record.email = email_clean
            user_record.firstName = first_name
            user_record.lastName = last_name
            user_record.role = "CUSTOMER"
            user_record.membershipTier = "BASIC"

    user_id = user_record.id
    user_email = user_record.email
    first_name = user_record.firstName or ""
    last_name = user_record.lastName or ""
    full_name = f"{first_name} {last_name}".strip() or user_email.split("@")[0]
    user_role = user_record.role
    user_tier = user_record.membershipTier

    secret = settings.CLERK_SECRET_KEY or "shopsmart-secret-dev-key-2026"
    now = datetime.now(timezone.utc)
    claims = {
        "sub": user_id,
        "email": user_email,
        "role": user_role,
        "membership_tier": user_tier,
        "first_name": first_name,
        "last_name": last_name,
        "exp": now + timedelta(days=7),
        "iat": now,
        "iss": "shopsmart-auth",
        "aud": "shopsmart-api",
    }
    access_token = jwt.encode(claims, secret, algorithm="HS256")

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=LoginUserPayload(
            id=user_id,
            email=user_email,
            name=full_name,
            role=user_role,
            membership_tier=user_tier,
            membershipTier=user_tier,
        ),
    )


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: AuthUser = Depends(get_current_user)):
    """Fetch current authenticated Clerk user profile and tier."""
    db = get_prisma()
    if db.is_connected():
        user = await db.user.find_unique(where={"id": current_user.id})
        if not user and current_user.email:
            user = await db.user.find_unique(where={"email": current_user.email})
        if user:
            return UserProfileResponse(
                id=user.id,
                email=user.email,
                firstName=user.firstName,
                lastName=user.lastName,
                role=user.role,
                membershipTier=user.membershipTier,
            )

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        firstName=current_user.first_name,
        lastName=current_user.last_name,
        role=current_user.role,
        membershipTier=current_user.membership_tier,
    )


@router.put("/preferences", status_code=status.HTTP_200_OK)
async def update_preferences(
    payload: CustomerPreferenceUpdate,
    current_user: AuthUser = Depends(get_current_user),
):
    """Save customer preferences (preferred categories and budget range)."""
    db = get_prisma()
    if db.is_connected():
        categories_str = ",".join(payload.preferredCategories) if payload.preferredCategories else None
        await db.customerpreference.upsert(
            where={"userId": current_user.id},
            data={
                "create": {
                    "userId": current_user.id,
                    "preferredCategories": categories_str,
                    "budgetMin": payload.budgetMin,
                    "budgetMax": payload.budgetMax,
                },
                "update": {
                    "preferredCategories": categories_str,
                    "budgetMin": payload.budgetMin,
                    "budgetMax": payload.budgetMax,
                },
            },
        )
    return {"status": "updated", "userId": current_user.id}


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def clerk_webhook(event: ClerkWebhookEvent):
    """Handle Clerk user lifecycle webhooks (user.created, user.updated)."""
    db = get_prisma()
    event_type = event.type
    user_data = event.data

    if not db.is_connected():
        return {"received": True}

    if event_type in ("user.created", "user.updated"):
        user_id = user_data.get("id")
        email_addresses = user_data.get("email_addresses", [])
        primary_email = email_addresses[0].get("email_address") if email_addresses else f"{user_id}@clerk.user"
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")

        await db.user.upsert(
            where={"id": user_id},
            data={
                "create": {
                    "id": user_id,
                    "email": primary_email,
                    "firstName": first_name,
                    "lastName": last_name,
                },
                "update": {
                    "email": primary_email,
                    "firstName": first_name,
                    "lastName": last_name,
                },
            },
        )

    return {"received": True, "event": event_type}
