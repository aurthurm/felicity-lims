import logging
from pathlib import Path

import emails
from jinja2 import Template
from emails.template import JinjaTemplate

from beak.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def send_email(
    email_to: str,
    subject_template: str = "",
    html_template: str = "",
    environment: dict = None,
) -> None:
    if environment is None:
        environment = {}
    assert settings.EMAILS_ENABLED, "no provided configuration for email variables"
    message = emails.Message(
        subject=JinjaTemplate(subject_template),
        html=JinjaTemplate(html_template),
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )

    if settings.DEBUG:
        rendered_subject = subject_template
        rendered_html = html_template
        try:
            rendered_subject = Template(subject_template).render(**environment)
            rendered_html = Template(html_template).render(**environment)
        except Exception as exc:
            logger.warning("Failed to render debug email preview: %s", exc)

        logger.info("DEBUG EMAIL OUTBOUND")
        logger.info(
            "email.from=%s <%s>",
            settings.EMAILS_FROM_NAME,
            settings.EMAILS_FROM_EMAIL,
        )
        logger.info("email.to=%s", email_to)
        logger.info("email.subject=%s", rendered_subject)
        logger.info("email.context=%s", environment)
        logger.info("email.body_html=%s", rendered_html)

    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, render=environment, smtp=smtp_options)
    logger.info("send email result: %s", response)


def send_test_email(email_to: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={"project_name": settings.PROJECT_NAME, "email": email_to},
    )


def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery token for user {email}"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "reset_password.html") as f:
        template_str = f.read()
    server_host = settings.SERVER_HOST
    link = f"{server_host}/reset-password?token={token}"
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "reset_token": link,
        },
    )


def send_new_account_email(email_to: str, username: str, password: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "new_account.html") as f:
        template_str = f.read()
    link = settings.SERVER_HOST
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": link,
        },
    )
