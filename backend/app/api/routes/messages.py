from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.database import UserAccount, load_user_state, save_user_state

router = APIRouter(tags=["messages"])


@router.get("/messages/conversations")
async def get_conversations(user: UserAccount = Depends(get_current_user)):
    messages = load_user_state(user.id, "messages", {"conversations": [], "messagesByConversation": {}})
    return {"conversations": messages["conversations"]}


@router.get("/messages/{conversation_id}")
async def get_messages(conversation_id: str, user: UserAccount = Depends(get_current_user)):
    messages = load_user_state(user.id, "messages", {"conversations": [], "messagesByConversation": {}})
    return {"messages": messages["messagesByConversation"].get(conversation_id, [])}


@router.post("/messages/{conversation_id}")
async def send_message(conversation_id: str, payload: dict, user: UserAccount = Depends(get_current_user)):
    stored_messages = load_user_state(user.id, "messages", {"conversations": [], "messagesByConversation": {}})
    conversation_messages = stored_messages["messagesByConversation"].get(conversation_id, [])
    message = {
        "id": f"msg-{len(conversation_messages) + 1}",
        "conversationId": conversation_id,
        "text": payload.get("text", ""),
        "sender": "me",
        "timestamp": "now",
    }
    stored_messages["messagesByConversation"].setdefault(conversation_id, []).append(message)
    save_user_state(user.id, "messages", stored_messages)
    return message
