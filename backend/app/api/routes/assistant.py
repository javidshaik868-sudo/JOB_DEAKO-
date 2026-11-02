from __future__ import annotations

import re
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

from app.api.dependencies import get_current_user, get_user_from_token
from app.database import UserAccount, load_state, load_user_state, save_user_state
from app.services.llm_service import llm_service

router = APIRouter(tags=["assistant"])


def find_matching_jobs(prompt: str, jobs: list[dict]) -> list[dict]:
    prompt_lower = prompt.lower()
    terms = [term for term in re.findall(r"[a-zA-Z+#.-]+", prompt_lower) if len(term) > 1]
    stop_terms = {"find", "show", "jobs", "role", "roles", "work", "with", "that", "suit", "me", "for", "remote", "experience", "years", "system", "engineer"}
    role_terms = [term for term in terms if term not in stop_terms]
    ranked = []
    for job in jobs:
        searchable = " ".join([
            job.get("title", ""), job.get("company", ""), job.get("location", ""),
            job.get("description", ""), " ".join(job.get("skills", [])), job.get("workMode", ""),
        ]).lower()
        score = sum(2 for term in role_terms if term in searchable)
        if "remote" in prompt_lower and job.get("workMode", "").lower() == "remote":
            score += 5
        if re.search(r"\b(?:0|0-1|fresher|entry\b)", prompt_lower):
            experience = job.get("experience", "")
            if re.search(r"(?:^|[- ])0(?:[- ]|\b)", experience.lower()) or "0-1" in experience.lower():
                score += 5
        if any(term in searchable for term in ("system", "engineer") if term in prompt_lower):
            score += 3
        if score > 0:
            ranked.append((score, job))
    ranked.sort(key=lambda item: (item[0], item[1].get("matchScore", 0)), reverse=True)
    return [job for _, job in ranked[:5]]


@router.get("/assistant/sessions")
async def list_sessions(user: UserAccount = Depends(get_current_user)):
    return {"sessions": list(load_user_state(user.id, "assistant_sessions", {}).values())}


@router.post("/assistant/sessions")
async def create_session(payload: dict | None = None, user: UserAccount = Depends(get_current_user)):
    session_id = str(uuid.uuid4())
    payload = payload or {}
    sessions = load_user_state(user.id, "assistant_sessions", {})
    sessions[session_id] = {
        "id": session_id,
        "title": payload.get("title", "Career Guidance"),
        "createdAt": payload.get("createdAt") or datetime.now(timezone.utc).isoformat(),
        "messages": [],
    }
    save_user_state(user.id, "assistant_sessions", sessions)
    return {"sessionId": session_id, "createdAt": sessions[session_id]["createdAt"]}


@router.post("/assistant/sessions/{session_id}/messages")
async def add_message(session_id: str, payload: dict, user: UserAccount = Depends(get_current_user)):
    sessions = load_user_state(user.id, "assistant_sessions", {})
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    message = payload.get("message") or payload.get("text")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    session["messages"].append({"role": "user", "text": message})
    save_user_state(user.id, "assistant_sessions", sessions)

    current_job = None
    job_id = payload.get("jobId") or payload.get("job_id")
    if job_id:
        current_job = next((job for job in load_state("jobs") if job.get("id") == job_id), None)

    profile = load_user_state(user.id, "profile", {})
    live_jobs = load_state("jobs")
    reply = await llm_service.generate_reply(message, {
        "messages": session["messages"][:-1],
        "current_job": current_job,
        "live_jobs": live_jobs,
        "matching_jobs": find_matching_jobs(message, live_jobs),
        "profile": profile,
    })
    session["messages"].append({"role": "assistant", "text": reply["text"]})
    save_user_state(user.id, "assistant_sessions", sessions)
    return {"sessionId": session_id, "message": message, "reply": reply["text"], "provider": reply.get("provider", "mock")}


@router.websocket("/assistant/ws/{session_id}")
async def assistant_socket(websocket: WebSocket, session_id: str):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return
    try:
        user = get_user_from_token(token)
    except HTTPException:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    sessions = load_user_state(user.id, "assistant_sessions", {})
    if session_id not in sessions:
        sessions[session_id] = {"id": session_id, "title": "oneAi Career Guidance", "messages": []}
        save_user_state(user.id, "assistant_sessions", sessions)

    try:
        while True:
            data = await websocket.receive_text()
            sessions = load_user_state(user.id, "assistant_sessions", {})
            messages = sessions[session_id].setdefault("messages", [])
            messages.append({"role": "user", "text": data})
            save_user_state(user.id, "assistant_sessions", sessions)
            response = await llm_service.generate_reply(data, {
                "messages": messages[:-1],
                "live_jobs": load_state("jobs"),
                "profile": load_user_state(user.id, "profile", {}),
            })
            messages.append({"role": "assistant", "text": response["text"]})
            save_user_state(user.id, "assistant_sessions", sessions)
            await websocket.send_text(response["text"])
    except WebSocketDisconnect:
        pass
