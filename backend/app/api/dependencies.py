from __future__ import annotations

from fastapi import HTTPException, Request
from jose import JWTError, jwt

from app.config import settings
from app.database import SessionLocal, UserAccount


def get_user_from_token(token: str) -> UserAccount:
    try:
        claims = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = claims.get("sub")
        token_version = claims.get("ver")
    except JWTError as error:
        raise HTTPException(status_code=401, detail="Invalid or expired session") from error

    with SessionLocal() as session:
        user = session.get(UserAccount, user_id) if user_id else None
        if user is None or not user.is_verified or user.token_version != token_version:
            raise HTTPException(status_code=401, detail="Invalid or expired session")
        session.expunge(user)
        return user


def get_current_user(request: Request) -> UserAccount:
    authorization = request.headers.get("authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return get_user_from_token(authorization.removeprefix("Bearer ").strip())