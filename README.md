# Job Dheako

Job Dheako is a full-stack job-search and career-support application. Candidates can explore jobs and companies, manage profiles and resumes, save jobs, track applications, and use career resources. The backend also provides an AI career assistant and local voice features.

## Technology

- Frontend: React, Vite, and React Router
- Backend: Python, FastAPI, and SQLAlchemy
- Database: PostgreSQL
- Optional local AI: Ollama and faster-whisper

## Run locally on Windows

Install Python, Node.js, PostgreSQL, and (if using the AI features) Ollama. From the project root:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
```

Configure `backend\.env` for your local PostgreSQL connection. Use `backend\.env.example` as a template; never commit `.env` or share its secrets. Start the development services with:

```powershell
.\start-dev.ps1
```

The application starts the FastAPI backend at `http://localhost:8000` and the Vite frontend at `http://localhost:5173`. Swagger UI is available at `http://localhost:8000/docs` in development. PostgreSQL must be reachable at the host and port configured by `DATABASE_URL`. The backend initializes its tables and sample catalogs at startup.

For the local Ollama assistant, start Ollama and ensure the model configured by `OLLAMA_MODEL` is installed. Voice transcription and speech synthesis use locally installed components and can require additional system resources.

## Configuration and deployment

Keep credentials in environment variables or the deployment platform's secret manager. A hosted deployment needs a reachable PostgreSQL database and a frontend `VITE_API_BASE_URL` pointing to the backend's HTTPS API URL, ending in `/api/v1`. Configure production `ENVIRONMENT`, `DEBUG`, `SECRET_KEY`, `CORS_ORIGINS`, SMTP, and AI/voice services before deployment.

This repository is a development/portfolio implementation. Review `backend\README.md` for current production limitations and additional deployment considerations.
