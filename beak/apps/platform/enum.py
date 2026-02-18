from enum import StrEnum


class PlatformRole(StrEnum):
    BILLING = "billing"
    PROVISIONER = "provisioner"
    SUPPORT = "support"
    ADMINISTRATOR = "administrator"
