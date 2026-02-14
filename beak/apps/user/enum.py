from enum import StrEnum


class UserType(StrEnum):
    DISPATCH_CONTACT = "dcuser"
    CLIENT_CONTACT = "ccuser"
    LABORATORY_CONTACT = "lcuser"
