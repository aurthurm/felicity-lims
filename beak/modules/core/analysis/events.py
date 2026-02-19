from beak.modules.core.commune.sms.services import SmsMessageService
from beak.core.config import get_settings
from beak.core.events import subscribe

settings = get_settings()


async def sample_published(uid: str):
    await SmsMessageService().create_sms_for_sample(uid=uid)


def init_analysis_events():
    subscribe("sample-published", sample_published)
