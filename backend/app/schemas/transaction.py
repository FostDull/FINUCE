from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class TransactionCreate(BaseModel):
    account_id: UUID
    type: str
    amount: float


class TransactionResponse(TransactionCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
