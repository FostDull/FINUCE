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


@router.get("/compare-today-yesterday")
def compare_today_yesterday():
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)

    def total_for_day(day):
        result = payments_collection.aggregate([
            {
                "$match": {
                    "created_at": {
                        "$gte": day,
                        "$lt": day + timedelta(days=1)
                    },
                    "status": "succeeded", "pending": False
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$amount"}
                }
            }
        ])
        data = list(result)
        return data[0]["total"] / 100 if data else 0

    today_total = total_for_day(today)
    yesterday_total = total_for_day(yesterday)

    return {
        "today": today_total,
        "yesterday": yesterday_total,
        "difference": today_total - yesterday_total
    }


@router.get("/revenue-7-days")
def revenue_last_7_days():
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = today - timedelta(days=6)

    pipeline = [
        {
            "$match": {
                "created_at": {"$gte": start_date},
                "status": "succeeded"
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at"
                    }
                },
                "total": {"$sum": "$amount"}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    results = list(payments_collection.aggregate(pipeline))

    # Formatear para el frontend
    data = []
    for i in range(7):
        day = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        match = next((r for r in results if r["_id"] == day), None)

        data.append({
            "date": day,
            "amount": (match["total"] / 100) if match else 0
        })

    return {"data": data}
