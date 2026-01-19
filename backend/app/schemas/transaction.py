from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Literal


class TransactionCreate(BaseModel):
    account_id: UUID
    amount: float
    type: Literal["credit", "debit"]


class TransactionResponse(TransactionCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
