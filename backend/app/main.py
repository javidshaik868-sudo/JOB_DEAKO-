from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    applications,
    assistant,
    auth,
    career_resources,
    companies,
    job_alerts,
    jobs,
    messages,
    notifications,
    profile,
    resume,
    voice,
)
from app.config import settings
from app.database import initialize_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings.validate_production_settings()
    initialize_database()
    yield

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    debug=settings.debug,
    docs_url=None if settings.environment == "production" else "/docs",
    redoc_url=None if settings.environment == "production" else "/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Accept", "Authorization", "Content-Type"],
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Job Dheako backend is running", "docs": "/docs"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(jobs.router, prefix=settings.api_prefix)
app.include_router(companies.router, prefix=settings.api_prefix)
app.include_router(profile.router, prefix=settings.api_prefix)
app.include_router(applications.router, prefix=settings.api_prefix)
app.include_router(messages.router, prefix=settings.api_prefix)
app.include_router(notifications.router, prefix=settings.api_prefix)
app.include_router(resume.router, prefix=settings.api_prefix)
app.include_router(job_alerts.router, prefix=settings.api_prefix)
app.include_router(career_resources.router, prefix=settings.api_prefix)
app.include_router(assistant.router, prefix=settings.api_prefix)
app.include_router(voice.router, prefix=settings.api_prefix)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
