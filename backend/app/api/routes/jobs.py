from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_state, load_user_state, save_user_state

router = APIRouter(tags=["jobs"])


@router.get("/jobs")
async def list_jobs(
    q: str | None = Query(default=None),
    location: str | None = None,
    workMode: str | None = None,
    experience: str | None = None,
    salary: str | None = None,
    jobType: str | None = None,
    skills: str | None = None,
    sort: str | None = None,
    page: int = 1,
):
    jobs = load_state("jobs")
    if q:
        jobs = [job for job in jobs if q.lower() in job["title"].lower() or q.lower() in job["company"].lower()]
    if location:
        jobs = [job for job in jobs if location.lower() in job["location"].lower()]
    if workMode:
        jobs = [job for job in jobs if job["workMode"].lower() == workMode.lower()]
    if experience:
        jobs = [job for job in jobs if experience.lower() in job["experience"].lower()]
    if jobType:
        jobs = [job for job in jobs if job["jobType"].lower() == jobType.lower()]
    if skills:
        skill_values = [skill.strip().lower() for skill in skills.split(",") if skill.strip()]
        jobs = [job for job in jobs if any(skill.lower() in [s.lower() for s in job["skills"]] for skill in skill_values)]

    if sort == "salary_high_to_low":
        jobs = sorted(jobs, key=lambda item: item["salary"], reverse=True)

    page_size = 10
    start = (page - 1) * page_size
    end = start + page_size
    paginated = jobs[start:end]
    return {"jobs": paginated, "total": len(jobs), "page": page, "totalPages": max(1, (len(jobs) + page_size - 1) // page_size)}


@router.get("/jobs/saved")
async def get_saved_jobs(user: UserAccount = Depends(get_current_user)):
    saved_ids = set(load_user_state(user.id, "saved_job_ids", []))
    jobs = [job for job in load_state("jobs") if job["id"] in saved_ids]
    return {"savedJobs": jobs, "total": len(jobs)}


@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = next((item for item in load_state("jobs") if item["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/jobs/{job_id}/save")
async def save_job(job_id: str, user: UserAccount = Depends(get_current_user)):
    saved_ids = load_user_state(user.id, "saved_job_ids", [])
    if job_id not in saved_ids:
        saved_ids.append(job_id)
        save_user_state(user.id, "saved_job_ids", saved_ids)
    return {"success": True, "saved": True, "jobId": job_id}


@router.delete("/jobs/{job_id}/save")
async def unsave_job(job_id: str, user: UserAccount = Depends(get_current_user)):
    saved_ids = [saved_id for saved_id in load_user_state(user.id, "saved_job_ids", []) if saved_id != job_id]
    save_user_state(user.id, "saved_job_ids", saved_ids)
    return {"success": True, "saved": False, "jobId": job_id}
