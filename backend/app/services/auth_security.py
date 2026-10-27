from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import smtplib
import ssl
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from jose import jwt

from app.config import settings
from app.database import UserAccount


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1)
    return "scrypt$16384$" + base64.urlsafe_b64encode(salt).decode() + "$" + base64.urlsafe_b64encode(derived).decode()


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, cost, salt_text, expected_text = encoded.split("$", 3)
        if algorithm != "scrypt":
            return False
        salt = base64.urlsafe_b64decode(salt_text)
        expected = base64.urlsafe_b64decode(expected_text)
        actual = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=int(cost), r=8, p=1)
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def hash_challenge(value: str, purpose: str) -> str:
    return hmac.new(settings.secret_key.encode(), f"{purpose}:{value}".encode(), hashlib.sha256).hexdigest()


def create_access_token(user: UserAccount) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode(
        {"sub": user.id, "ver": user.token_version, "exp": expires_at},
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def public_user(user: UserAccount) -> dict[str, str | None]:
    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "headline": "",
        "location": "",
        "avatar": None,
        "phone": user.phone,
    }


def send_email(to_address: str, subject: str, body: str) -> None:
    if not settings.smtp_host:
        raise RuntimeError("SMTP_HOST is not configured")

    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = to_address
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as client:
        if settings.smtp_use_tls:
            client.starttls(context=ssl.create_default_context())
        if settings.smtp_user:
            client.login(settings.smtp_user, settings.smtp_password or "")
        client.send_message(message)


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"