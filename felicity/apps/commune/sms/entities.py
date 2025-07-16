from sqlalchemy import DateTime, Enum, Column, ForeignKey, String, Text, Boolean
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity
from felicity.apps.commune.sms.enum import SmsAudience, SmsTrigger


class SmsTemplate(LabScopedEntity):
    """SmsTemplate"""

    __tablename__ = "sms_template"

    name = Column(String, nullable=False)
    template = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    messages = relationship("SmsMessage", back_populates="template")
    # Target for the template (analysis service, result, etc.)
    target_type = Column(
        String(100), nullable=False, doc="The table name of the altered object"
    )
    target_uid = Column(String, doc="The UID of the altered object")
    # When to trigger the SMS
    specification_trigger = Column(Enum(SmsTrigger), nullable=True)
    # Who should receive the SMS
    audience = Column(Enum(SmsAudience), nullable=False, default=SmsAudience.PATIENT)
    is_active = Column(Boolean, default=True)


class SmsMessage(LabScopedEntity):
    __tablename__ = "sms_message"
    
    template_uid = Column(String, ForeignKey("sms_template.uid"), nullable=True)
    recipient = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="pending")  # pending, sent, failed
    error =  Column(String, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    template = relationship("SmsTemplate", back_populates="messages")
    target_type = Column(
        String(100), nullable=True, doc="The table name of the object with message"
    )
    target_uid = Column(String, doc="The UID of the object", nullable=True)