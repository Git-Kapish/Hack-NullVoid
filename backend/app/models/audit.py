from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column("actorId", Text, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)  # e.g., TICKET_CREATE, DOCUMENT_UPLOAD, TOOL_CALL
    resource_type = Column("resourceType", String(100), nullable=False)  # e.g., ORDER, SUPPORT_TICKET, KNOWLEDGE_DOC
    resource_id = Column("resourceId", String(100), nullable=True)
    outcome = Column(String(50), nullable=False)  # SUCCESS, DENIED, FAILED
    request_id = Column("requestId", String(100), nullable=False, index=True)
    created_at = Column("createdAt", DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    actor = relationship("User")


class AIDecisionLog(Base):
    __tablename__ = "ai_decision_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Text, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    request_id = Column(String(100), nullable=False, index=True)
    decision_type = Column(String(50), nullable=False, index=True)  # RECOMMENDATION, KNOWLEDGE_ANSWER, TOOL_SELECTION
    input_params = Column(JSON, nullable=True)  # constraints, query, filters
    output_result = Column(JSON, nullable=True)  # candidate IDs, reasons, selected sources, reply
    model_id = Column(String(100), nullable=False)
    outcome = Column(String(50), nullable=False)  # ANSWERED, NO_MATCH, ABSTAINED, ERROR
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    actor = relationship("User")
