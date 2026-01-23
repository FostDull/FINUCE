from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.schemas.account import AccountResponse
from app.core.auth import get_current_user

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("/me", response_model=AccountResponse)
def get_my_account(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = (
        db.query(Account)
        .filter(Account.user_id == user["sub"])
        .first()
    )

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return account
