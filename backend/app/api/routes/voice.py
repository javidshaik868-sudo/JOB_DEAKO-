from __future__ import annotations

import tempfile
import logging
from functools import lru_cache
from pathlib import Path
from threading import Lock

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.schemas import VoiceSpeakRequest

router = APIRouter(tags=["voice"])
logger = logging.getLogger(__name__)
_whisper_lock = Lock()


@lru_cache(maxsize=1)
def _get_whisper_model():
    from faster_whisper import WhisperModel

    return WhisperModel(
        settings.whisper_model,
        device=settings.whisper_device,
        compute_type=settings.whisper_compute_type,
    )


def _transcribe_audio(audio_path: str) -> tuple[str, str]:
    segments, info = _get_whisper_model().transcribe(audio_path, beam_size=5, vad_filter=True)
    text = " ".join(segment.text.strip() for segment in segments).strip()
    return text, info.language


def _transcribe_audio_safely(audio_path: str) -> tuple[str, str]:
    with _whisper_lock:
        return _transcribe_audio(audio_path)


def _synthesize_speech(text: str) -> bytes:
    import pyttsx3

    audio_path: str | None = None
    engine = pyttsx3.init()
    try:
        voice_hint = settings.tts_voice.lower()
        if voice_hint != "default":
            for voice in engine.getProperty("voices"):
                if voice_hint in f"{voice.id} {voice.name}".lower():
                    engine.setProperty("voice", voice.id)
                    break
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as audio_file:
            audio_path = audio_file.name
        engine.save_to_file(text, audio_path)
        engine.runAndWait()
        return Path(audio_path).read_bytes()
    finally:
        engine.stop()
        if audio_path:
            Path(audio_path).unlink(missing_ok=True)


@router.post("/voice/transcribe")
async def transcribe_voice(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Audio file is required")
    audio = await file.read()
    if not audio:
        raise HTTPException(status_code=400, detail="Audio file is empty")
    if len(audio) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"Audio must be smaller than {settings.max_upload_mb} MB")

    suffix = Path(file.filename).suffix or ".webm"
    audio_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as audio_file:
            audio_file.write(audio)
            audio_path = audio_file.name
        text, language = await run_in_threadpool(_transcribe_audio_safely, audio_path)
        if not text:
            raise HTTPException(status_code=422, detail="No speech was detected in the recording")
        return {"text": text, "language": language}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=503, detail="Local Whisper transcription failed. Check the model installation and audio format.") from error
    finally:
        if audio_path:
            Path(audio_path).unlink(missing_ok=True)


@router.post("/voice/speak")
async def speak_text(payload: VoiceSpeakRequest):
    try:
        audio = await run_in_threadpool(_synthesize_speech, payload.text)
    except Exception as error:
        logger.exception("Local system speech synthesis failed")
        raise HTTPException(status_code=503, detail="Local system speech synthesis failed") from error
    return Response(content=audio, media_type="audio/wav")
