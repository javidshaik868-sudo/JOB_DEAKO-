from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal


class Settings(BaseSettings):
    app_name: str = "Job Dheako API"
    api_prefix: str = "/api/v1"
    environment: Literal["development", "test", "production"] = "development"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    database_url: str = "postgresql+psycopg://jobdheako:jobdheako@localhost:5433/job_dheko"
    debug: bool = True
    secret_key: str = "job-dheako-dev-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    llm_provider: Literal["mock", "ollama"] = "ollama"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "jobdheako-career"
    whisper_model: str = "base"
    whisper_device: Literal["cpu", "cuda", "auto"] = "cpu"
    whisper_compute_type: str = "int8"
    max_upload_mb: int = 5
    tts_voice: str = "default"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from: str = "noreply@jobdheako.com"
    smtp_use_tls: bool = True
    frontend_url: str = "http://localhost:5173"
    otp_expire_minutes: int = 10
    max_otp_attempts: int = 5
    expose_dev_codes: bool = True

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    def validate_production_settings(self) -> None:
        if self.environment != "production":
            return

        if self.debug:
            raise RuntimeError("DEBUG must be false in production")
        if len(self.secret_key) < 32 or self.secret_key.lower().startswith(("change-me", "replace-with", "job-dheako-dev")):
            raise RuntimeError("SECRET_KEY must be a unique random value of at least 32 characters in production")
        if not self.allowed_origins or "*" in self.allowed_origins:
            raise RuntimeError("CORS_ORIGINS must contain explicit origins in production")
        if self.expose_dev_codes:
            raise RuntimeError("EXPOSE_DEV_CODES must be false in production")
        if not self.smtp_host or not self.smtp_user or not self.smtp_password:
            raise RuntimeError("SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are required in production")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
