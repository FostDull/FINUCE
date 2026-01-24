from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class PaymentCreate(BaseModel):
    amount: Decimal


class PaymentResponse(BaseModel):
    id: UUID
    amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
