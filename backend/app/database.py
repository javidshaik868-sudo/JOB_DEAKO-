from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, Index, Integer, String, create_engine, func, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


class AppState(Base):
    __tablename__ = "app_state"

    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[Any] = mapped_column(JSON, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=func.now(),
        nullable=False,
    )


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    role: Mapped[str] = mapped_column(String(24), default="candidate", nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    token_version: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class AuthChallenge(Base):
    __tablename__ = "auth_challenges"
    __table_args__ = (Index("ix_auth_challenges_email_purpose", "email", "purpose"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    purpose: Mapped[str] = mapped_column(String(32), nullable=False)
    code_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    data: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def _ensure_database_exists() -> None:
    database_url = make_url(settings.database_url)
    if not database_url.drivername.startswith("postgresql"):
        raise RuntimeError("DATABASE_URL must use PostgreSQL")
    if not database_url.database or database_url.database == "postgres":
        raise RuntimeError("DATABASE_URL must target the job_dheako database")

    administrative_engine = create_engine(
        database_url.set(database="postgres"),
        isolation_level="AUTOCOMMIT",
        connect_args={"connect_timeout": 5},
    )
    try:
        with administrative_engine.connect() as connection:
            exists = connection.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :name"),
                {"name": database_url.database},
            ).scalar_one_or_none()
            if not exists:
                database_name = administrative_engine.dialect.identifier_preparer.quote(database_url.database)
                connection.exec_driver_sql(f"CREATE DATABASE {database_name}")
    finally:
        administrative_engine.dispose()


def _initial_state() -> dict[str, Any]:
    from app.data.demo_data import (
        sample_companies,
        sample_jobs,
        sample_resources,
    )

    return {
        "jobs": sample_jobs,
        "companies": sample_companies,
        "career_resources": sample_resources,
    }


def initialize_database() -> None:
    _ensure_database_exists()
    Base.metadata.create_all(bind=engine)
    with SessionLocal.begin() as session:
        for key, value in _initial_state().items():
            if session.get(AppState, key) is None:
                session.add(AppState(key=key, value=deepcopy(value)))


def load_state(key: str) -> Any:
    with SessionLocal() as session:
        record = session.get(AppState, key)
        if record is None:
            raise KeyError(f"Database state '{key}' has not been initialized")
        return deepcopy(record.value)


def save_state(key: str, value: Any) -> None:
    with SessionLocal.begin() as session:
        record = session.get(AppState, key)
        if record is None:
            session.add(AppState(key=key, value=deepcopy(value)))
        else:
            record.value = deepcopy(value)


def load_user_state(user_id: str, key: str, default: Any) -> Any:
    state_key = f"user:{user_id}:{key}"
    try:
        return load_state(state_key)
    except KeyError:
        save_state(state_key, default)
        return deepcopy(default)


def save_user_state(user_id: str, key: str, value: Any) -> None:
    save_state(f"user:{user_id}:{key}", value)