from sqlalchemy import Column, Float, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey(
        "accounts.id"), nullable=False)
    type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
