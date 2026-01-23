from pydantic import BaseModel
from uuid import UUID


class AccountCreate(BaseModel):
    name: str


class AccountResponse(AccountCreate):
    id: UUID
    balance: float

    class Config:
        from_attributes = True
