from beak.core.config import settings
from beak.utils.sms.client import SmsClient


sms_client = SmsClient(
    url=settings.SMS_API_URL,
    access_token=settings.SMS_TOKEN,
    username=settings.SMS_USERNAME,
    password=settings.SMS_PASSWORD,
)

__all__ = ["sms_client"]
