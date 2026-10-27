from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["notifications"])


@router.get("/notifications")
async def get_notifications(category: str | None = None, user: UserAccount = Depends(get_current_user)):
    notifications = load_user_state(user.id, "notifications", [])
    if category and category != "all":
        notifications = [item for item in notifications if item["category"] == category]
    return {"notifications": notifications, "unreadCount": sum(1 for item in notifications if not item["read"]) }


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: UserAccount = Depends(get_current_user)):
    notifications = load_user_state(user.id, "notifications", [])
    for item in notifications:
        if item["id"] == notification_id:
            item["read"] = True
            save_user_state(user.id, "notifications", notifications)
            return {"success": True, "id": notification_id}
    return {"success": True, "id": notification_id}


@router.post("/notifications/mark-all-read")
async def mark_all_read(user: UserAccount = Depends(get_current_user)):
    notifications = load_user_state(user.id, "notifications", [])
    for item in notifications:
        item["read"] = True
    save_user_state(user.id, "notifications", notifications)
    return {"success": True}
