from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

from app.api.dependencies import get_current_user, get_user_from_token
from app.database import UserAccount, load_user_state, save_user_state
from app.services.llm_service import llm_service

router = APIRouter(tags=["assistant"])

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
        "createdAt": payload.get("createdAt") or "2026-10-13T12:00:00Z",
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
    reply = await llm_service.generate_reply(message, {"messages": session["messages"][:-1]})
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
            response = await llm_service.generate_reply(data, {"messages": messages[:-1]})
            messages.append({"role": "assistant", "text": response["text"]})
            save_user_state(user.id, "assistant_sessions", sessions)
            await websocket.send_text(response["text"])
    except WebSocketDisconnect:
        pass
