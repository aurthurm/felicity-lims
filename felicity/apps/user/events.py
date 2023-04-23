from core.config import settings
from utils.email.email import send_new_account_email, send_reset_password_email
from core.events import subscribe


def new_account_created(**kwargs):
    send_new_account_email(
        settings.FIRST_SUPERUSER_EMAIL,
        settings.FIRST_SEPERUSER_USERNAME,
        settings.FIRST_SUPERUSER_PASSWORD,
    )


def password_reset(user, token):
    send_reset_password_email(
        email_to=user.email, email=user.email, token=password_reset_token
    )
    # TODO: MAYBE ADD SECURITY QUESTIONS TO RECOVER PASSWORD or give them a passphrase to remember
    # TODO: send them a new passwod to their registered phone
    # TODO: SEND USER A DEFAULT PASSWORD TO LOGIN WITH SO THEY CAN CHANGE LATER


def init_user_events():
    subscribe("new-account-created", new_account_created)
    subscribe("password-reset", password_reset)
