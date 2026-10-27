from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["applications"])


@router.get("/applications")
async def get_applications(status: str | None = None, user: UserAccount = Depends(get_current_user)):
    apps = load_user_state(user.id, "applications", [])
    if status and status != "all":
        apps = [app for app in apps if app["status"] == status]
    return {"applications": apps, "total": len(apps)}


@router.get("/applications/{application_id}")
async def get_application(application_id: str, user: UserAccount = Depends(get_current_user)):
    for app in load_user_state(user.id, "applications", []):
        if app["id"] == application_id:
            return app
    raise HTTPException(status_code=404, detail="Application not found")


@router.post("/applications")
async def submit_application(payload: dict, user: UserAccount = Depends(get_current_user)):
    apps = load_user_state(user.id, "applications", [])
    app_data = {
        "id": f"app-{len(apps) + 1}",
        "jobId": payload.get("jobId"),
        "jobTitle": payload.get("jobTitle") or "Custom Role",
        "company": payload.get("company") or "Hiring Team",
        "status": "applied",
        "appliedAt": payload.get("appliedAt") or "2026-10-13T12:00:00Z",
    }
    apps.append(app_data)
    save_user_state(user.id, "applications", apps)
    return app_data


@router.get("/applications/{application_id}/interview-slots")
async def get_interview_slots(application_id: str, user: UserAccount = Depends(get_current_user)):
    return {
        "interviewType": "Technical Round 1",
        "duration": "45 mins",
        "interviewer": "Tech Lead / Staff Engineer",
        "dates": [
            {"date": "Tomorrow, Oct 14", "slots": ["10:00 AM", "02:00 PM", "04:30 PM"]},
            {"date": "Thursday, Oct 16", "slots": ["11:00 AM", "03:00 PM"]},
        ],
    }


@router.post("/applications/{application_id}/schedule")
async def schedule_interview(application_id: str, payload: dict, user: UserAccount = Depends(get_current_user)):
    apps = load_user_state(user.id, "applications", [])
    for application in apps:
        if application["id"] == application_id:
            application.update(
                {
                    "scheduledTime": payload.get("slot"),
                    "scheduledDate": payload.get("date"),
                    "status": "interview_scheduled",
                }
            )
            save_user_state(user.id, "applications", apps)
            break
    return {
        "success": True,
        "applicationId": application_id,
        "scheduledTime": payload.get("slot"),
        "scheduledDate": payload.get("date"),
        "status": "interview_scheduled",
    }
