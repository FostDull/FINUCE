from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class AccountResponse(BaseModel):
    id: UUID
    user_id: UUID
    balance: Decimal
    created_at: datetime

    class Config:
        from_attributes = True
