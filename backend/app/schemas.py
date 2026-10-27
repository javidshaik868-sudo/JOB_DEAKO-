from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    token: str
    user: dict[str, Any]


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Literal["candidate", "recruiter"] = "candidate"
    phone: str | None = None


class OTPVerifyRequest(BaseModel):
    email: str
    otp: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str


class JobFilterRequest(BaseModel):
    q: str | None = None
    location: str | None = None
    workMode: str | None = None
    experience: str | None = None
    salary: str | None = None
    jobType: str | None = None
    skills: str | None = None
    sort: str | None = None
    page: int | None = 1


class AssistantMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)


class VoiceSpeakRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=3000)


class GenericResponse(BaseModel):
    success: bool = True
    message: str | None = None
