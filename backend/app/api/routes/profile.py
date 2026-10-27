from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, UploadFile

from app.api.dependencies import get_current_user
from app.database import SessionLocal, UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["profile"])


def _default_profile(user: UserAccount):
    return {
        "name": user.full_name,
        "title": "",
        "email": user.email,
        "phone": user.phone or "",
        "location": "",
        "avatar": None,
        "bio": "",
        "experienceYears": "",
        "currentCompany": "",
        "currentRole": "",
        "noticePeriod": "",
        "isFresher": False,
        "resumeName": "",
        "resumeUrl": "",
        "skills": [],
        "experience": [],
        "education": [],
        "projects": [],
        "certifications": [],
    }


@router.get("/profile")
async def get_profile(user: UserAccount = Depends(get_current_user)):
    return load_user_state(user.id, "profile", _default_profile(user))


@router.put("/profile")
async def update_profile(payload: dict, user: UserAccount = Depends(get_current_user)):
    profile = load_user_state(user.id, "profile", _default_profile(user))
    requested_email = payload.get("email")
    if requested_email and requested_email.strip().lower() != user.email:
        raise HTTPException(status_code=409, detail="Email changes require email verification")

    profile.update({key: value for key, value in payload.items() if key != "email"})
    with SessionLocal.begin() as session:
        account = session.get(UserAccount, user.id)
        if account:
            account.full_name = str(profile.get("name", account.full_name))[:160]
            account.phone = str(profile.get("phone") or "")[:40] or None
    save_user_state(user.id, "profile", profile)
    return profile


@router.post("/profile/avatar")
async def upload_avatar(file: UploadFile, user: UserAccount = Depends(get_current_user)):
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="No avatar file uploaded")
    import base64

    data_url = f"data:{file.content_type or 'image/png'};base64,{base64.b64encode(file_bytes).decode('utf-8')}"
    profile = load_user_state(user.id, "profile", _default_profile(user))
    profile["avatar"] = data_url
    save_user_state(user.id, "profile", profile)
    return {"avatarUrl": data_url}
