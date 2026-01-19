from pydantic import BaseModel
from typing import Optional


class AccountCreate(BaseModel):
    user_id: str
    account_number: str
    balance: float = 0.0


class AccountResponse(AccountCreate):
    id: int

    class Config:
        from_attributes = True
