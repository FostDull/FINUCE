from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    balance = Column(Float, default=0)
