from __future__ import annotations

from typing import Any

import httpx

from app.config import settings


class LLMService:
    def __init__(self) -> None:
        self.provider = settings.llm_provider

    def _fallback_reply(self, prompt: str) -> str:
        prompt_lower = prompt.lower()

        if "resume" in prompt_lower or "cv" in prompt_lower:
            return (
                "Your resume should emphasize measurable impact, ATS-friendly keywords, and clear role outcomes. "
                "Focus on results like revenue growth, process improvements, and tool-specific skills tied to the jobs you want."
            )
        if "interview" in prompt_lower:
            return (
                "Prepare for behavioral and technical questions by using the STAR method. Practice explaining trade-offs, "
                "system design decisions, and how you improved performance in past roles."
            )
        if "job" in prompt_lower or "career" in prompt_lower or "role" in prompt_lower:
            return (
                "Based on your profile, the strongest opportunities are in product engineering, cloud-native platforms, and AI-assisted product work. "
                "Prioritize companies with strong engineering culture, measurable impact, and clear upskilling paths."
            )
        return (
            "I can help you refine your job search strategy, improve your resume, and prepare for interviews. "
            "Share your target role, industry preference, or experience level and I’ll suggest the next best step."
        )

    async def generate_reply(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        if self.provider == "ollama":
            try:
                history = (context or {}).get("messages", [])
                messages = [
                    {"role": item["role"], "content": item.get("text", "")}
                    for item in history[-20:]
                    if item.get("role") in {"user", "assistant"} and item.get("text")
                ]
                messages.append({"role": "user", "content": prompt})

                async with httpx.AsyncClient(timeout=120) as client:
                    response = await client.post(
                        f"{settings.ollama_base_url.rstrip('/')}/api/chat",
                        json={
                            "model": settings.ollama_model,
                            "messages": messages,
                            "stream": False,
                            "keep_alive": "10m",
                            "options": {"temperature": 0.4, "num_predict": 512},
                        },
                    )
                    response.raise_for_status()
                    payload = response.json()
                    text = payload.get("message", {}).get("content", "").strip()
                    if text:
                        return {"text": text, "provider": "ollama"}
            except Exception:
                pass

        return {"text": self._fallback_reply(prompt), "provider": "mock"}


llm_service = LLMService()
