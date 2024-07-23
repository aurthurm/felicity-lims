from celery import Celery

celery_app = Celery("worker", broker="amqp://guest@queue//")

celery_app.enum.task_routes = {"app.worker.test_celery": "main-queue"}
