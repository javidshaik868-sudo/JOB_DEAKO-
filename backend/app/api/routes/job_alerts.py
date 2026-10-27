from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["job-alerts"])

@router.get("/job-alerts")
async def get_alerts(user: UserAccount = Depends(get_current_user)):
    return {"alerts": load_user_state(user.id, "job_alerts", [])}


@router.post("/job-alerts")
async def create_alert(payload: dict, user: UserAccount = Depends(get_current_user)):
    alerts = load_user_state(user.id, "job_alerts", [])
    alert = {
        "id": f"alert-{len(alerts) + 1}",
        "status": "active",
        "createdAt": "2026-10-13T12:00:00Z",
        **payload,
    }
    alerts.append(alert)
    save_user_state(user.id, "job_alerts", alerts)
    return alert


@router.patch("/job-alerts/{alert_id}/status")
async def update_alert_status(alert_id: str, payload: dict, user: UserAccount = Depends(get_current_user)):
    alerts = load_user_state(user.id, "job_alerts", [])
    for alert in alerts:
        if alert["id"] == alert_id:
            alert["status"] = payload.get("status", alert["status"])
            save_user_state(user.id, "job_alerts", alerts)
            return {"success": True, "id": alert_id, "status": alert["status"]}
    return {"success": True, "id": alert_id, "status": payload.get("status")}


@router.delete("/job-alerts/{alert_id}")
async def delete_alert(alert_id: str, user: UserAccount = Depends(get_current_user)):
    alerts = [alert for alert in load_user_state(user.id, "job_alerts", []) if alert["id"] != alert_id]
    save_user_state(user.id, "job_alerts", alerts)
    return {"success": True, "id": alert_id}
