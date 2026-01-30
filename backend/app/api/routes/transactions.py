from fastapi import APIRouter, status
from app.database.mongo import payments_collection

router = APIRouter(
    prefix="/payments/transactions",
    tags=["Transactions"]
)


@router.get("", status_code=status.HTTP_200_OK)
def list_transactions():
    transactions = list(
        payments_collection.find().sort("created_at", -1).limit(100)
    )

    for tx in transactions:
        tx["id"] = str(tx.pop("_id"))

    return {"data": transactions}
