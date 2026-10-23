from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.clerk_auth import get_current_user, AuthUser
from app.core.database import get_prisma
from app.schemas.support import CreateTicketRequest, SupportTicketResponse

router = APIRouter(prefix="/support", tags=["Customer Support"])


@router.post("/tickets", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    payload: CreateTicketRequest,
    current_user: AuthUser = Depends(get_current_user),
):
    """Create a new support ticket with optional order ownership validation."""
    db = get_prisma()
    if not db.is_connected():
        raise HTTPException(status_code=503, detail="Database unavailable")

    # If orderId is provided, verify it belongs to this user
    if payload.orderId:
        order = await db.order.find_first(
            where={"id": payload.orderId, "userId": current_user.id}
        )
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order #{payload.orderId} not found in your account",
            )

    ticket = await db.supportticket.create(
        data={
            "userId": current_user.id,
            "orderId": payload.orderId,
            "subject": payload.subject,
            "description": payload.description,
            "status": "OPEN",
        }
    )

    # Record Audit Event
    await db.auditevent.create(
        data={
            "actorId": current_user.id,
            "action": "CREATE_SUPPORT_TICKET",
            "resourceType": "SUPPORT_TICKET",
            "resourceId": str(ticket.id),
            "outcome": "SUCCESS",
            "requestId": "api-request",
        }
    )

    return SupportTicketResponse(
        id=ticket.id,
        userId=ticket.userId,
        orderId=ticket.orderId,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        createdAt=ticket.createdAt,
    )


@router.get("/tickets", response_model=List[SupportTicketResponse])
async def list_tickets(current_user: AuthUser = Depends(get_current_user)):
    """List support tickets submitted by current user."""
    db = get_prisma()
    if not db.is_connected():
        return []

    tickets = await db.supportticket.find_many(
        where={"userId": current_user.id},
        order={"createdAt": "desc"},
    )
    return [
        SupportTicketResponse(
            id=t.id,
            userId=t.userId,
            orderId=t.orderId,
            subject=t.subject,
            description=t.description,
            status=t.status,
            createdAt=t.createdAt,
        )
        for t in tickets
    ]
