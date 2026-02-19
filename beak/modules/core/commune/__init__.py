from starlette.status import HTTP_200_OK

from beak.modules.core.commune.sms.enum import SmsStatus
from beak.modules.core.commune.sms.services import SmsMessageService
from beak.core.dtz import timenow_dt
from beak.utils.sms import sms_client


async def send_scheduled_sms() -> None:
    messages = await SmsMessageService().get_all(status=SmsStatus.SCHEDULED)
    for m in messages:
        try:
            status, response = await sms_client.send(to=m.recipient, message=m.message)
            if status == HTTP_200_OK:
                m.status = SmsStatus.SENT
            else:
                m.status = SmsStatus.FAILED
                m.error = response.text
        except Exception as e:
            m.status = SmsStatus.FAILED
            m.error = str(e)
        finally:
            m.sent_at = timenow_dt()
            await SmsMessageService().save(m)
