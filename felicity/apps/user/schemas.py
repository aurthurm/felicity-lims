from typing import List, Optional

from apps.common.schemas import BaseAuditModel, BaseModel
from apps.user.conf import themes

from pydantic import EmailStr

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
    uid: str| None = None


class PermissionInDBBase(PermissionBase):
    uid: str| None = None

    class Config:
        orm_mode = True


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
    uid: str| None = None


class GroupInDBBase(GroupBase):
    uid: str| None = None

    class Config:
        orm_mode = True


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
    expanded_menu: bool| None = False
    departments: Optional[List["Department"]]
    theme: str | None = themes.LIGHT


class UserPreference(UserPreferenceBase):
    uid: str| None = None

    class Config:
        orm_mode = True


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


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: bool| None = True
    is_superuser: bool = False
    first_name: str | None = None
    last_name: str | None = None
    password: str | None = None
    user_name: str | None = None
    avatar: str | None = None
    bio: str | None = None
    default_route: str | None = None
    groups: Optional[Group] = []


# Properties to receive via API on creation
class UserCreate(UserBase):
    pass


# Properties to receive via API on update
class UserUpdate(UserBase):
    auth_uid: str| None = None
    preference_uid: str| None = None


class UserInDBBase(UserBase):
    uid: str| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class UserBasic(UserBasicBase):
    uid: str| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    pass


#
#  Auth Schema
#


# Shared properties
class AuthBase(BaseModel):
    user_name: str | None = None
    password: str | None = None
    login_retry: int | None = 0
    is_blocked: bool| None = False
    user_type: str | None = None


# Properties to receive via API on creation
class AuthCreate(AuthBase):
    user_name: str
    password: str
    login_retry: int = 0
    is_blocked: bool = False


# Properties to receive via API on update
class AuthUpdate(AuthBase):
    pass


class AuthInDBBase(AuthBase):
    uid: str| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Auth(AuthInDBBase):
    pass


# Additional properties stored in DB
class AuthInDB(AuthInDBBase):
    hashed_password: str
