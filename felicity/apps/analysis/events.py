from felicity.core.config import get_settings
from felicity.core.events import subscribe
from felicity.apps.commune.sms.services import SmsMessageService

settings = get_settings()


def sample_published(uid: str):
    SmsMessageService().create_sms_for_sample(uid=uid)


def init_analysis_events():
    subscribe("sample-published", sample_published)
