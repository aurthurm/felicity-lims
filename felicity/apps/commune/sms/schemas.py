from datetime import datetime
from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel


#
# SmsTemplate Schemas
#


# Shared properties
class SmsTemplateBase(BaseAuditModel):
    name: str | None
    template: str | None
    description: str | None
    target_type: str | None
    target_uid: str | None
    specification_trigger: str | None
    audience: str | None
    is_active: bool = False


class SmsTemplateBaseInDB(SmsTemplateBase):
    uid: str | None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class SmsTemplateCreate(SmsTemplateBase):
    pass


# Properties to receive via API on update
class SmsTemplateUpdate(SmsTemplateBase):
    pass


# Properties to return via API
class SmsTemplate(SmsTemplateBaseInDB):
    pass


# Properties stored in DB
class SmsTemplateInDB(SmsTemplateBaseInDB):
    pass


#
# SmsMessage Schemas
#

# Shared properties
class SmsMessageBase(BaseAuditModel):
    template_uid: str | None
    recipient: str | None
    message: str | None
    status: str | None
    sent_at: datetime | None
    target_type: str | None
    target_uid: str | None


class SmsMessageBaseInDB(SmsMessageBase):
    uid: str | None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class SmsMessageCreate(SmsMessageBase):
    pass


# Properties to receive via API on update
class SmsMessageUpdate(SmsMessageBase):
    pass


# Properties to return via API
class SmsMessage(SmsMessageBaseInDB):
    pass


# Properties stored in DB
class SmsMessageInDB(SmsMessageBaseInDB):
    pass

