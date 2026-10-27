# Job Dheako Backend

FastAPI backend for the Job Dheako frontend. This repository currently provides a locally testable implementation, not a complete production marketplace backend.

## Included

- Candidate registration with email OTP, scrypt password hashes, signed access tokens, reset links, and logout revocation
- Per-account profile, resume, application, alert, message, notification, saved-job, and oneAi session state
- Shared sample job, company, and career-resource catalogs for development
- Local Ollama-based oneAi assistant, faster-whisper transcription, and Windows SAPI speech synthesis
- PostgreSQL storage and Docker Compose development service
- Swagger/OpenAPI at `/docs` in development only

## PostgreSQL persistence

The database is named `job_dheko`. On startup, the backend connects using `DATABASE_URL`, creates the database if it does not exist (the configured PostgreSQL role needs `CREATEDB`), creates tables, and seeds shared sample catalogs when empty. User-owned resources are stored in namespaced JSON state documents and survive backend restarts.

The Compose PostgreSQL service maps to host port `5433` so it does not conflict with a native PostgreSQL service on `5432`. Its local development URL and credentials are in `.env.example`. For an installed PostgreSQL service, change `DATABASE_URL` in `.env` to that server's host port, username, and password. The PostgreSQL database name remains `job_dheko`.

The current API stores each account's resource collections as JSON documents in PostgreSQL to preserve the frontend's existing payloads. It is not a normalized relational marketplace schema, and Alembic migrations are not yet wired into deployment.

## Production configuration

Set `ENVIRONMENT=production`, `DEBUG=false`, a unique random `SECRET_KEY` of at least 32 characters, and a comma-separated `CORS_ORIGINS` allowlist before starting the API. Production startup rejects debug mode, placeholder secrets, and wildcard CORS; Swagger and ReDoc are disabled in production. Keep `.env` out of source control and use Windows Credential Manager or the deployment platform's secret store for production credentials.

Production authentication also requires `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASSWORD` to deliver verification and password-reset codes; set `EXPOSE_DEV_CODES=false`. Development may leave SMTP blank, in which case verification/reset codes are returned to the local UI only. Accounts use scrypt password hashes, expiring single-use challenges, and short-lived signed access tokens.

## Run locally

From the project root on Windows, prepare both dependency environments and launch the app with:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
.\start-dev.ps1
```

`setup.ps1` uses `backend/.venv` and `backend/requirements.txt` for Python, and `frontend/package.json` for npm. It creates `backend/.env` from `.env.example` only when the active file does not already exist. `start-dev.ps1` starts the Compose PostgreSQL service when Docker is installed, then opens backend and frontend terminals.

```bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/macOS
docker compose up -d
uvicorn app.main:app --reload
```

API base: `http://localhost:8000/api/v1`
Docs: `http://localhost:8000/docs`

Worker:

```bash
celery -A worker.celery_app worker --loglevel=info
```

## Important production steps

1. Create normalized tables and a managed Alembic migration workflow.
2. Configure production PostgreSQL credentials, a random secret, CORS origins, and authenticated SMTP credentials in a secret store.
3. Add rate limiting for login, OTP, reset, and WebSocket endpoints.
4. Put FastAPI behind HTTPS/reverse proxy and configure trusted hosts, backups, observability, and CI/CD.
5. Replace sample job/company/resource catalogs with vetted live data and add recruiter ownership/authorization before enabling publishing.
6. Store uploads in object storage and scan them; current resume analysis and voice routes are local implementations.
7. Validate Windows SAPI, Ollama model availability, and Whisper resource requirements under the actual Windows service account.

## Job Dheako AI Chat + Voice Assistant

The frontend design can use two controls:

- **AI Chat Board**: `POST /api/v1/assistant/sessions`, then `POST /api/v1/assistant/sessions/{session_id}/messages`.
- **Realtime AI chat**: `ws://localhost:8000/api/v1/assistant/ws/{session_id}?token=<ACCESS_TOKEN>`.
- **Voice button at the top**: record browser microphone audio and send it to `POST /api/v1/voice/transcribe` as multipart field `file`.
- Send the returned `text` to the AI chat endpoint.
- Send the AI `reply` to `POST /api/v1/voice/speak`; the response is `audio/mpeg` and can be played by an HTML Audio element.

### Local AI setup

The default backend configuration uses a local Ollama model. From the backend folder, create the Job Dheako career assistant model:

```bash
ollama pull phi3:mini
ollama create jobdheako-career -f Modelfile
```

The custom model is a local Phi-3 mini model with Job Dheako career-coach instructions and response settings. Prompts stay on this machine; the LLM and voice paths require no hosted API keys. Ensure Ollama is running with `ollama serve`; `.env` selects it using `LLM_PROVIDER=ollama` and `OLLAMA_MODEL=jobdheako-career`.

For the uncustomized Ollama base model, install and start Ollama, then pull the configured model:

```bash
ollama pull phi3
ollama serve
```

Set `LLM_PROVIDER=mock` in `.env` to use built-in demo replies instead.

Voice transcription uses local `faster-whisper`; spoken replies use the Windows SAPI voice through `pyttsx3`. Neither requires a hosted speech API key. The first transcription downloads/loads the configured Whisper model, so keep the machine online for initial model setup or pre-download the model before offline use.

### Frontend flow for the supplied design

```text
Microphone icon (top)
       |
       v
POST /voice/transcribe
       |
       v
POST /assistant/sessions/{id}/messages
       |
       +----> show reply in AI Chat Board
       |
       v
POST /voice/speak
       |
       v
play audio/mpeg
```
