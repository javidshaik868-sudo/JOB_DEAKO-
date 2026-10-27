from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["resume"])


def _default_resume(user: UserAccount):
    return {
        "documentTitle": f"{user.full_name} Resume",
        "documentHtml": "",
        "personalInfo": {
            "fullName": user.full_name,
            "email": user.email,
            "phone": user.phone or "",
            "location": "",
            "website": "",
            "linkedin": "",
        },
        "summary": "",
        "experience": [],
        "education": [],
        "skills": [],
    }


@router.get("/resume")
async def get_resume(user: UserAccount = Depends(get_current_user)):
    return load_user_state(user.id, "resume", _default_resume(user))


@router.put("/resume")
async def save_resume(payload: dict, user: UserAccount = Depends(get_current_user)):
    resume = load_user_state(user.id, "resume", _default_resume(user))
    resume.update(payload)
    save_user_state(user.id, "resume", resume)
    return {"success": True, "data": resume}


@router.post("/resume/analyze")
async def analyze_resume(file: UploadFile = File(...), user: UserAccount = Depends(get_current_user)):
    await file.read()
    return {
        "fileName": file.filename or "resume.pdf",
        "overallScore": 84,
        "status": "Strong Candidate",
        "categories": [
            {"name": "ATS Compatibility", "score": 92, "status": "pass"},
            {"name": "Keyword Alignment", "score": 81, "status": "good"},
            {"name": "Quantified Impact", "score": 78, "status": "needs-improvement"},
            {"name": "Formatting & Layout", "score": 90, "status": "pass"},
        ],
        "matchingSkills": ["React", "TypeScript", "Node.js", "AWS", "Docker", "RESTful APIs"],
        "missingKeywords": ["Kubernetes", "CI/CD Pipelines", "System Architecture", "Kafka"],
        "suggestions": [
            "Add measurable outcomes to your latest role (e.g., % improvement, revenue impact).",
            "Include cloud orchestration terms like Kubernetes or Terraform.",
            "Maintain single-column formatting for top ATS scanner readability.",
        ],
    }
