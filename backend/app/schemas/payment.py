from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class PaymentResponse(BaseModel):
    id: UUID
    amount: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
