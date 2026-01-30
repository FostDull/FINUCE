from fastapi import APIRouter
from datetime import datetime, timedelta

from app.core.mongo import payments_collection

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary():
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    payments = list(
        payments_collection.find({
            "created_at": {"$gte": today},
            "status": "succeeded"
        })
    )

    volume = sum(p["amount"] for p in payments) / 100

    return {
        "today_volume": volume,
        "today_count": len(payments),
    }
