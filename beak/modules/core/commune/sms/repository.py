from beak.modules.core.abstract import BaseRepository
from beak.modules.core.commune.sms.entities import SmsMessage, SmsTemplate


class SmsTemplateRepository(BaseRepository[SmsTemplate]):
    def __init__(self) -> None:
        super().__init__(SmsTemplate)


class SmsMessageRepository(BaseRepository[SmsMessage]):
    def __init__(self) -> None:
        super().__init__(SmsMessage)
