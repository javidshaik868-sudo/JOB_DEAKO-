from __future__ import annotations

from fastapi import Header, HTTPException, Request


async def get_auth_token(request: Request) -> str:
    authorization = request.headers.get("authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    return authorization.split(" ", 1)[1]
