from celery import Celery
from app.core.config import settings
from app.services.emailer import send_email

celery_app = Celery("job_dheako", broker=settings.celery_broker_url, backend=settings.celery_result_backend)

@celery_app.task
def send_notification_email(to: str, subject: str, body: str):
    send_email(to, subject, body)

@celery_app.task
def rebuild_recommendations(candidate_id: int):
    # Hook for a periodic recommendation/indexing pipeline.
    return {"candidate_id": candidate_id, "status": "queued"}
