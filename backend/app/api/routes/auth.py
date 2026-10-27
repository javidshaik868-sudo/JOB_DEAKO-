from __future__ import annotations

import hmac
import logging
import re
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy import select
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.database import AuthChallenge, SessionLocal, UserAccount
from app.services.auth_security import (
    create_access_token,
    generate_otp,
    hash_challenge,
    hash_password,
    public_user,
    send_email,
    verify_password,
)

router = APIRouter(tags=["auth"])
logger = logging.getLogger(__name__)


def _normalized_email(value: object) -> str:
    if not isinstance(value, str):
        raise HTTPException(status_code=422, detail="A valid email address is required")
    email = value.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=422, detail="A valid email address is required")
    return email


def _validate_password(password: object) -> str:
    if not isinstance(password, str) or len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"\d", password) or not re.search(r"[^A-Za-z0-9\s]", password):
        raise HTTPException(status_code=422, detail="Password must have 8 characters, an uppercase letter, a number, and a symbol")
    return password


def _create_challenge(email: str, purpose: str, code: str, data: dict | None = None) -> None:
    now = datetime.now(timezone.utc)
    challenge = AuthChallenge(
        id=str(uuid.uuid4()),
        email=email,
        purpose=purpose,
        code_hash=hash_challenge(code, purpose),
        data=data,
        created_at=now,
        expires_at=now + timedelta(minutes=settings.otp_expire_minutes),
    )
    with SessionLocal.begin() as session:
        active_challenges = session.scalars(
            select(AuthChallenge).where(
                AuthChallenge.email == email,
                AuthChallenge.purpose == purpose,
                AuthChallenge.used_at.is_(None),
            )
        ).all()
        for active_challenge in active_challenges:
            active_challenge.used_at = now
        session.add(challenge)


async def _deliver_or_expose_code(email: str, subject: str, body: str, code: str) -> str | None:
    try:
        await run_in_threadpool(send_email, email, subject, body)
        return None
    except Exception as error:
        if settings.environment == "development" and settings.expose_dev_codes:
            logger.warning("Auth email was not delivered; returning a development-only code")
            return code
        logger.exception("Auth email delivery failed")
        raise HTTPException(status_code=503, detail="Email delivery is unavailable") from error


def _current_user(request: Request) -> UserAccount:
    authorization = request.headers.get("authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.removeprefix("Bearer ").strip()
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


def _success_response(email: str, message: str, code: str | None, key: str) -> dict:
    response = {"success": True, "email": email, "message": message}
    if code:
        response[key] = code
    return response


@router.post("/auth/signup")
async def signup(payload: dict):
    email = _normalized_email(payload.get("email"))
    password = _validate_password(payload.get("password"))
    full_name = payload.get("fullName") or payload.get("name")
    if not isinstance(full_name, str) or not full_name.strip():
        raise HTTPException(status_code=422, detail="Full name is required")

    role = payload.get("role", "candidate")
    if role not in {"candidate", "recruiter"}:
        raise HTTPException(status_code=422, detail="Invalid account role")

    with SessionLocal() as session:
        existing_user = session.scalar(select(UserAccount.id).where(UserAccount.email == email))
    if existing_user:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    code = generate_otp()
    user_data = {
        "full_name": full_name.strip()[:160],
        "password_hash": hash_password(password),
        "role": role,
        "phone": str(payload.get("phone") or "")[:40] or None,
    }
    _create_challenge(email, "verify-email", code, user_data)
    debug_code = await _deliver_or_expose_code(
        email,
        "Verify your Job Dheako account",
        f"Your verification code is {code}. It expires in {settings.otp_expire_minutes} minutes.",
        code,
    )
    return _success_response(email, "Verification code sent.", debug_code, "debugOtp")


@router.post("/auth/resend-otp")
async def resend_otp(payload: dict):
    email = _normalized_email(payload.get("email"))
    with SessionLocal() as session:
        pending = session.scalar(
            select(AuthChallenge)
            .where(
                AuthChallenge.email == email,
                AuthChallenge.purpose == "verify-email",
                AuthChallenge.used_at.is_(None),
            )
            .order_by(AuthChallenge.created_at.desc())
        )
        user_exists = session.scalar(select(UserAccount.id).where(UserAccount.email == email))
        data = pending.data if pending and pending.created_at > datetime.now(timezone.utc) - timedelta(hours=24) else None
        attempts = pending.attempts if pending else 0
    if user_exists or not data:
        raise HTTPException(status_code=400, detail="No pending email verification was found")
    if attempts >= settings.max_otp_attempts:
        raise HTTPException(status_code=429, detail="Too many verification attempts")

    code = generate_otp()
    _create_challenge(email, "verify-email", code, data)
    debug_code = await _deliver_or_expose_code(
        email,
        "Your Job Dheako verification code",
        f"Your verification code is {code}. It expires in {settings.otp_expire_minutes} minutes.",
        code,
    )
    return _success_response(email, "Verification code sent.", debug_code, "debugOtp")


@router.post("/auth/verify-otp")
async def verify_otp(payload: dict):
    email = _normalized_email(payload.get("email"))
    code = payload.get("otp")
    if not isinstance(code, str) or not re.fullmatch(r"\d{6}", code):
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")

    error_status: int | None = None
    with SessionLocal.begin() as session:
        challenge = session.scalar(
            select(AuthChallenge)
            .where(
                AuthChallenge.email == email,
                AuthChallenge.purpose == "verify-email",
                AuthChallenge.used_at.is_(None),
            )
            .order_by(AuthChallenge.created_at.desc())
        )
        now = datetime.now(timezone.utc)
        if challenge is None or challenge.expires_at <= now:
            error_status = 400
        elif challenge.attempts >= settings.max_otp_attempts:
            error_status = 429
        elif not hmac.compare_digest(challenge.code_hash, hash_challenge(code, "verify-email")):
            challenge.attempts += 1
            error_status = 400
        else:
            data = challenge.data or {}
            user = UserAccount(
                id=str(uuid.uuid4()),
                email=email,
                full_name=data["full_name"],
                password_hash=data["password_hash"],
                role=data["role"],
                phone=data.get("phone"),
                is_verified=True,
            )
            challenge.used_at = now
            session.add(user)
            session.flush()
            response = {"token": create_access_token(user), "user": public_user(user)}

    if error_status == 429:
        raise HTTPException(status_code=429, detail="Too many verification attempts")
    if error_status:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
    return response


@router.post("/auth/login")
async def login(payload: dict):
    email = _normalized_email(payload.get("email"))
    password = payload.get("password")
    if not isinstance(password, str):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    with SessionLocal() as session:
        user = session.scalar(select(UserAccount).where(UserAccount.email == email))
        if user is None or not user.is_verified or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        response = {"token": create_access_token(user), "user": public_user(user)}
    return response


@router.post("/auth/forgot-password")
async def forgot_password(payload: dict):
    email = _normalized_email(payload.get("email"))
    with SessionLocal() as session:
        user = session.scalar(select(UserAccount).where(UserAccount.email == email, UserAccount.is_verified.is_(True)))
        user_id = user.id if user else None

    debug_token = None
    if user_id:
        token = secrets.token_urlsafe(32)
        _create_challenge(email, "reset-password", token, {"user_id": user_id})
        reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={token}"
        debug_token = await _deliver_or_expose_code(
            email,
            "Reset your Job Dheako password",
            f"Use this link to reset your password. It expires in {settings.otp_expire_minutes} minutes:\n{reset_url}",
            token,
        )

    response = {"success": True, "message": "If that account exists, reset instructions have been sent."}
    if debug_token:
        response["debugResetToken"] = debug_token
    return response


@router.post("/auth/reset-password")
async def reset_password(payload: dict):
    token = payload.get("token")
    if not isinstance(token, str) or len(token) < 32:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    password = _validate_password(payload.get("newPassword"))
    token_hash = hash_challenge(token, "reset-password")
    error = False
    with SessionLocal.begin() as session:
        challenge = session.scalar(
            select(AuthChallenge).where(
                AuthChallenge.code_hash == token_hash,
                AuthChallenge.purpose == "reset-password",
                AuthChallenge.used_at.is_(None),
            )
        )
        now = datetime.now(timezone.utc)
        if challenge is None or challenge.expires_at <= now:
            error = True
        else:
            user = session.get(UserAccount, (challenge.data or {}).get("user_id"))
            if user is None:
                error = True
            else:
                user.password_hash = hash_password(password)
                user.token_version += 1
                challenge.used_at = now
    if error:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    return {"success": True, "message": "Password reset successfully"}


@router.get("/auth/me")
async def get_current_user(request: Request):
    return public_user(_current_user(request))


@router.post("/auth/logout")
async def logout(request: Request):
    user = _current_user(request)
    with SessionLocal.begin() as session:
        current_user = session.get(UserAccount, user.id)
        if current_user:
            current_user.token_version += 1
    return {"success": True, "message": "Logged out successfully"}
