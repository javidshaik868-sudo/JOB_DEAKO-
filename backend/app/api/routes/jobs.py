from __future__ import annotations

import re

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
        terms = [term for term in q.lower().replace("/", " ").split() if len(term) > 1]
        filtered = []
        for job in jobs:
            searchable = " ".join([
                job.get("title", ""), job.get("company", ""), job.get("location", ""),
                job.get("description", ""), " ".join(job.get("skills", [])),
            ]).lower()
            if any(term in searchable for term in terms):
                filtered.append(job)
        jobs = filtered
    if location:
        jobs = [job for job in jobs if location.lower() in job["location"].lower()]
    if workMode:
        jobs = [job for job in jobs if job["workMode"].lower() == workMode.lower()]
    if experience:
        match = re.search(r"(\d+)\s*-\s*(\d+|\+)", experience)
        if match:
            requested_min = int(match.group(1))
            requested_max = None if match.group(2) == "+" else int(match.group(2))
            compatible = []
            for job in jobs:
                ranges = re.findall(r"(\d+)\s*-\s*(\d+)", job.get("experience", ""))
                plus_range = re.search(r"(\d+)\s*\+", job.get("experience", ""))
                if ranges:
                    job_min, job_max = int(ranges[0][0]), int(ranges[0][1])
                elif plus_range:
                    job_min, job_max = int(plus_range.group(1)), 99
                else:
                    continue
                if requested_max is None:
                    overlaps = job_max >= requested_min
                else:
                    overlaps = job_min <= requested_max and job_max >= requested_min
                if overlaps:
                    compatible.append(job)
            jobs = compatible
        else:
            jobs = [job for job in jobs if experience.lower() in job["experience"].lower()]
    if jobType:
        jobs = [job for job in jobs if job["jobType"].lower() == jobType.lower()]
    if skills:
        skill_values = [skill.strip().lower() for skill in skills.split(",") if skill.strip()]
        jobs = [job for job in jobs if any(skill.lower() in [s.lower() for s in job["skills"]] for skill in skill_values)]

    if sort in {"salary", "salary_high_to_low"}:
        def salary_floor(item: dict) -> int:
            numbers = [int(value.replace(",", "")) for value in re.findall(r"\d+", item.get("salary", "0"))]
            return numbers[0] if numbers else 0
        jobs = sorted(jobs, key=salary_floor, reverse=True)
    elif sort == "relevance":
        jobs = sorted(jobs, key=lambda item: item.get("matchScore", 0), reverse=True)

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
