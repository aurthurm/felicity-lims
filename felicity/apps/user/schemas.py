from dataclasses import field
from typing import List, Optional

from pydantic import ConfigDict, EmailStr

from felicity.apps.common.schemas import BaseAuditModel, BaseModel


#
#  Permission Schema
#

# Shared properties


class PermissionBase(BaseModel):
    action: str | None = None
    target: str | None = None
    active: bool = False


# Properties to receive via API on creation
class PermissionCreate(PermissionBase):
    pass


# Properties to receive via API on update
class PermissionUpdate(PermissionBase):
    uid: str | None = None


class PermissionInDBBase(PermissionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Permission(PermissionInDBBase):
    pass


# Additional properties stored in DB
class PermissionInDB(PermissionInDBBase):
    pass


#
#  Group Schema
#


# Shared properties
class GroupBase(BaseModel):
    name: str | None = None
    keyword: str | None = None
    permissions: Optional[List[Permission]] = None
    active: bool = False


# Properties to receive via API on creation
class GroupCreate(GroupBase):
    pass


# Properties to receive via API on update
class GroupUpdate(GroupBase):
    uid: str | None = None


class GroupInDBBase(GroupBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Group(GroupInDBBase):
    pass


# Additional properties stored in DB
class GroupInDB(GroupInDBBase):
    pass


#
#  User Preferences
#
class UserPreferenceBase(BaseAuditModel):
    laboratory_uid: str | None = None
    user_uid: str
    expanded_menu: bool | None = False
    theme: str | None = "light"
    default_route: str | None = None


class UserPreference(UserPreferenceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UserPreferenceCreate(UserPreferenceBase):
    pass


class UserPreferenceUpdate(UserPreferenceBase):
    pass


#
#  User Schema
#

# Shared properties


class UserBasicBase(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    user_name: str | None = None


class UserBase(BaseAuditModel):
    email: Optional[EmailStr] = None
    first_name: str | None = None
    last_name: str | None = None
    password: str | None = None
    user_name: str | None = None
    avatar: str | None = None
    bio: str | None = None
    groups: Optional[List[Group]] = field(default_factory=list)
    login_retry: int | None = 0
    is_blocked: bool | None = False
    is_active: bool | None = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    pass


# Properties to receive via API on update
class UserUpdate(UserBase):
    preference_uid: str | None = None


class UserInDBBase(UserBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class UserBasic(UserBasicBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
