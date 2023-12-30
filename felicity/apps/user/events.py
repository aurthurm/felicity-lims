from core.config import settings
from core.events import subscribe
from utils.email.email import send_new_account_email, send_reset_password_email


def new_account_created(**kwargs):
    send_new_account_email(
        settings.FIRST_SUPERUSER_EMAIL,
        settings.FIRST_SEPERUSER_USERNAME,
        settings.FIRST_SUPERUSER_PASSWORD,
    )


def password_reset(user, token):
    send_reset_password_email(email_to=user.email, email=user.email, token=token)


def init_user_events():
    subscribe("new-account-created", new_account_created)
    subscribe("password-reset", password_reset)
