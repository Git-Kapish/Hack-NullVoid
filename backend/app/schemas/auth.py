from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserProfileResponse(BaseModel):
    id: str = Field(..., description="Clerk user ID")
    email: EmailStr
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    role: str = Field("CUSTOMER", description="CUSTOMER or ADMIN")
    membershipTier: str = Field("BASIC", description="BASIC, PRIME, or PREMIUM")


class CustomerPreferenceUpdate(BaseModel):
    preferredCategories: Optional[List[str]] = Field(default=[], description="List of preferred category slugs")
    budgetMin: Optional[float] = Field(None, ge=0)
    budgetMax: Optional[float] = Field(None, ge=0)


class ClerkWebhookEvent(BaseModel):
    data: dict
    object: str
    type: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = "password123"


class LoginUserPayload(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    membership_tier: str
    membershipTier: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUserPayload
