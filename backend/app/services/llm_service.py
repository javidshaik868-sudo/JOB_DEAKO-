from __future__ import annotations

from typing import Any
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


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
        context = context or {}
        current_job = context.get("current_job")
        live_jobs = context.get("live_jobs") or []
        profile = context.get("profile") or {}
        system_context = (
            "You are oneAi, Job Dheako's concise career assistant. "
            "Use the supplied database data as authoritative. Never invent current openings, salaries, "
            "company facts, or user qualifications. If information is unavailable, say so and ask for it. "
            "Give practical, specific career advice and base job recommendations only on the supplied jobs."
        )
        if profile:
            system_context += f" The user's profile is: {profile}."
        if live_jobs:
            system_context += f" The current live job catalog is: {live_jobs}."
        matching_jobs = context.get("matching_jobs")
        if matching_jobs:
            system_context += (
                " The database-matched jobs for the user's latest search are: "
                f"{matching_jobs}. For job-finding requests, first explain which matched jobs fit and why, "
                "list their exact titles, companies, locations, work modes, experience, salary, and job IDs, "
                "and do not add openings that are not in this matched list."
            )
        if current_job:
            system_context += (
                " The user is currently viewing this exact job posting: "
                f"{current_job}. Answer about this opening unless the user asks about another role."
            )

        if self.provider == "ollama":
            try:
                history = context.get("messages", [])
                messages = [
                    {"role": item["role"], "content": item.get("text", "")}
                    for item in history[-20:]
                    if item.get("role") in {"user", "assistant"} and item.get("text")
                ]
                messages.insert(0, {"role": "system", "content": system_context})
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
            except Exception as error:
                logger.error("Ollama LLM request failed: %s", error)

        fallback = self._fallback_reply(prompt)
        matching_jobs = context.get("matching_jobs") or []
        if matching_jobs and any(word in prompt.lower() for word in ("find", "search", "role", "job", "opening")):
            lines = []
            for job in matching_jobs:
                lines.append(
                    f"- {job.get('title')} at {job.get('company')} (ID {job.get('id')}): "
                    f"{job.get('location')}, {job.get('workMode')}, experience {job.get('experience')}, "
                    f"salary {job.get('salary')}, skills {', '.join(job.get('skills', []))}"
                )
            fallback = "Best matches from the current catalog:\n" + "\n".join(lines)
        if current_job:
            fallback = (
                f"You are viewing {current_job.get('title')} at {current_job.get('company')}. "
                f"Location: {current_job.get('location')}; work mode: {current_job.get('workMode')}; "
                f"experience: {current_job.get('experience')}; salary: {current_job.get('salary')}. "
                f"Required skills: {', '.join(current_job.get('skills', []))}. "
                "For more specific guidance about this posting, ask me to summarize it, assess your fit, or prepare interview questions."
            )
        return {"text": fallback, "provider": "mock"}


llm_service = LLMService()
