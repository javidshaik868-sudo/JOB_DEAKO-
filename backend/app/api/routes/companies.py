from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.database import load_state

router = APIRouter(tags=["companies"])


@router.get("/companies")
async def list_companies(q: str | None = Query(default=None), industry: str | None = None, location: str | None = None, page: int = 1):
    companies = load_state("companies")
    if q:
        companies = [company for company in companies if q.lower() in company["name"].lower() or q.lower() in company["tagline"].lower()]
    if industry:
        companies = [company for company in companies if company["industry"].lower() == industry.lower()]
    if location:
        companies = [company for company in companies if location.lower() in company["location"].lower()]
    page_size = 10
    start = (page - 1) * page_size
    end = start + page_size
    return {"companies": companies[start:end], "total": len(companies)}


@router.get("/companies/{company_id}")
async def get_company(company_id: str):
    company = next((item for item in load_state("companies") if item["id"] == company_id), None)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.get("/companies/{company_id}/jobs")
async def get_company_jobs(company_id: str):
    jobs = [job for job in load_state("jobs") if job.get("companyId") == company_id]
    return {"jobs": jobs, "total": len(jobs)}
