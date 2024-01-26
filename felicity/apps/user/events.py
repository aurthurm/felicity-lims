from felicity.core.config import get_settings
from felicity.core.events import subscribe
from felicity.utils.email.email import send_new_account_email, send_reset_password_email

settings = get_settings()

def new_account_created(**kwargs):
    send_new_account_email(
        settings.FIRST_SUPERUSER_EMAIL,
        settings.FIRST_SUPERUSER_USERNAME,
        settings.FIRST_SUPERUSER_PASSWORD,
    )


def password_reset(user, token):
    send_reset_password_email(email_to=user.email, email=user.email, token=token)


def init_user_events():
    subscribe("new-account-created", new_account_created)
    subscribe("password-reset", password_reset)
