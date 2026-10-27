from __future__ import annotations

from fastapi import APIRouter

from app.database import load_state

router = APIRouter(tags=["career-resources"])


@router.get("/career-resources")
async def get_resources(category: str | None = None):
    resources = load_state("career_resources")
    if category and category != "all":
        resources = [item for item in resources if item["category"] == category]
    return {"resources": resources}
