from fastapi import APIRouter, Depends, status
from app.core.clerk_auth import get_current_user, AuthUser
from app.core.database import get_prisma
from app.schemas.auth import UserProfileResponse, CustomerPreferenceUpdate, ClerkWebhookEvent

router = APIRouter(prefix="/auth", tags=["Authentication & User"])


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: AuthUser = Depends(get_current_user)):
    """Fetch current authenticated Clerk user profile and tier."""
    db = get_prisma()
    if db.is_connected():
        user = await db.user.find_unique(where={"id": current_user.id})
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
