from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Transaction(BaseModel):
    stripe_payment_intent_id: str
    amount: float
    currency: str
    status: str
    payment_method: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
