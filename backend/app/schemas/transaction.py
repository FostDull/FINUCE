from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionResponse(BaseModel):
    id: str
    amount: float
    currency: str
    status: str
    payment_method: Optional[str]
    description: Optional[str]
    created_at: datetime
