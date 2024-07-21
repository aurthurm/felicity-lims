from datetime import timedelta

from core.security import (
    verify_password,
    create_access_token,
    generate_password_reset_token,
    get_password_hash,
    password_check,
)
from core.setting import settings
from domain.exceptions import (
    AlreadyExistsError,
    NotAllowedError,
    NotFoundError,
    GenericError,
    ValidationError,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.shared.utils.validator import is_valid_email
from domain.user.conf import UserType
from domain.user.ports.repository import IUserRepository, IGroupRepository
from domain.user.ports.service import (
    IUserService,
    IGroupService,
    IPermissionService,
)
from domain.user.schemas import (
    User,
    UserCreate,
    UserUpdate,
    AuthenticatedUser,
    Group,
    GroupCreate,
    Permission,
    GroupPermission,
)


class UserService(BaseService[User], IUserService):
    repository = None
    user_preference_service = None
    group_service = None
    permission_service = None

    def __init__(
            self,
            repository: IUserRepository,
            group_service: IGroupService,
            permission_service: IPermissionService,
    ) -> None:
        self.repository = repository
        self.group_service = group_service
        self.permission_service = permission_service
        super().__init__(self.repository)

    async def create(
            self,
            first_name: str,
            last_name: str,
            email: str,
            user_name: str,
            password: str,
            passwordc: str,
            group_uid: str | None = None,
            open_reg: bool = False,
    ) -> User:
        user = await self.add_user(
            first_name, last_name, email, user_name, password, passwordc, open_reg
        )
        user = await self.add_to_group(user, group_uid)
        return await self.add_preferences(user)

    async def add_user(
            self,
            first_name: str,
            last_name: str,
            email: str,
            user_name: str,
            password: str,
            passwordc: str,
            open_reg: bool = False,
    ) -> User:

        if open_reg and not settings.USERS_OPEN_REGISTRATION:
            raise NotAllowedError("Open user registration is not allowed")

        if email:
            user_e = await self.get(email=email)
            if user_e:
                raise AlreadyExistsError(
                    "A user with this email already exists in the system"
                )

        if password != passwordc:
            raise ValidationError("Password do not match, try again")

        policy = password_check(password, user_name)
        if not policy["password_ok"]:
            raise ValidationError(policy["message"])

        user_in = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "user_name": user_name,
            "login_retry": 0,
            "password": password,
            "passwordc": password,
            "is_blocked": False,
            "is_superuser": False,
            "user_type": UserType.LABORATORY_CONTACT,
        }
        user_in = UserCreate(**user_in)
        return await self.repository.create(
            **{
                **marshal(user_in),
                "hashed_password": get_password_hash(user_in.password),
            }
        )

    async def add_to_group(self, user: User, group_uid: str) -> User:
        if not group_uid:
            raise ValidationError("group id is required")
        group = await self.group_service.get(uid=group_uid)
        user.groups.append(group)
        return await self.repository.update(user, **marshal(user))

    async def update(
            self,
            user_uid: str,
            first_name: str | None,
            last_name: str | None,
            mobile_phone: str | None,
            email: str | None,
            group_uid: str | None,
            is_active: bool | None,
    ) -> User:

        user = await self.get(uid=user_uid)
        if not user:
            raise NotFoundError("User not found")

        user_data = marshal(user).keys()
        if first_name and "first_name" in user_data:
            setattr(user, "first_name", first_name)
        if last_name and "last_name" in user_data:
            setattr(user, "last_name", last_name)
        if email and "email" in user_data:
            setattr(user, "email", email)
        if mobile_phone and "mobile_phone" in user_data:
            setattr(user, "mobile_phone", mobile_phone)
        if is_active and "is_active" in user_data:
            setattr(user, "is_active", is_active)

        user_in = UserUpdate(**marshal(user))
        user = await self.repository.update(user, **marshal(user_in))

        grp_ids = [grp.uid for grp in user.groups]
        if group_uid and group_uid not in grp_ids:
            group = await self.group_service.get(uid=group_uid)
            for grp in user.groups:
                user.groups.remove(grp)
            await self.repository.update(user, **marshal(user))
            user.groups = [group]
            await self.repository.update(user, **marshal(user))

        return user

    async def authenticate(self, username: str, password: str) -> AuthenticatedUser:

        if is_valid_email(username):
            user = await self.get(email=username)
        else:
            user = await self.get(username=username)

        if not user:
            raise NotFoundError(f"User with username {username} not found")

        has_access = await self.has_access(user, password)
        if not has_access:
            raise NotAllowedError("Authentication failed")

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = (
            create_access_token(user.uid, expires_delta=access_token_expires),
        )
        return AuthenticatedUser(token=access_token[0], token_type="bearer", user=user)

    async def recover_password(self, username: str) -> bool:
        auth = await self.user_auth_service.get(username=username)
        if not auth:
            raise NotFoundError("Error, failed to fetch user for password reset")

        password_reset_token = generate_password_reset_token(email=auth.user.email)

        # post_event("password_reset", user=user, token=password_reset_token)   noqa
        # msg = "Password recovery email sent"  noqa
        return True

    async def has_access(self, user: User, password):
        if user.is_blocked:
            raise NotAllowedError("Blocked Account: Reset Password to regain access")

        if not getattr(user, "is_active"):  # e.g self.ccuser.is_active
            raise NotAllowedError("In active account: contact administrator")

        user_obj = marshal(user)
        retries = user.login_retry
        if not verify_password(password, self.hashed_password):
            msg = ""
            if self.login_retry < 3:
                retries += 1
                msg = f"Wrong Password {3 - retries} attempts left"
                user_obj["login_retry"] = retries
                if retries == 3:
                    user_obj["is_blocked"] = True
                    msg = "Sorry your Account has been Blocked"
            await self.repository.update(user, **user_obj)
            raise GenericError(msg)
        if user.login_retry != 0:
            user_obj["login_retry"] = 0
            await self.repository.update(user, **user_obj)
        return user


class GroupService(BaseService[Group], IGroupService):
    def __init__(
            self, repository: IGroupRepository, permission_service: IPermissionService
    ):
        self.repository = repository
        self.permission_service = permission_service
        super().__init__(repository)

    async def create(self, name: str, pages: str, active: bool = True) -> Group:

        if not name:
            raise ValidationError("Name Required")

        group = await self.repository.get(name=name)
        if group:
            raise NotAllowedError(f"Group with name {name} already exists")

        incoming = {
            "keyword": name.upper(),
            "name": name,
            "pages": pages,
            "active": active,
            # "created_by_uid": felicityuser.uid,
            # "updated_by_uid": felicityuser.uid,
        }
        grp_in = GroupCreate(**incoming)
        return await self.repository.create(**marshal(grp_in))

    async def update_group(
            self, uid: str, name: str, pages: str, active: bool = True
    ) -> Group:

        group = await self.repository.get(uid=uid)
        if not group:
            raise NotFoundError(f"Group with uid {uid} does not exist")

        setattr(group, "name", name)
        setattr(group, "pages", pages)
        setattr(group, "active", active)
        setattr(group, "keyword", name.upper())

        return await self.repository.update(group, **marshal(group))

    async def update_group_permissions(
            self, group_uid: str, permission_uid: str
    ) -> GroupPermission:
        if not group_uid or not permission_uid:
            raise NotFoundError("Group and Permission are required.")

        group = await self.repository.get(uid=group_uid)
        if not group:
            raise NotFoundError(f"group with uid {group_uid} not found")

        if permission_uid in [perm.uid for perm in group.permissions]:
            permissions = filter(lambda p: p.uid == permission_uid, group.permissions)
            permission = list(permissions)[0]
            group.permissions.remove(permission)
        else:
            permission = await self.permission_service.get(uid=permission_uid)
            if not permission:
                raise NotFoundError(f"permission with uid {permission_uid} not found")
            group.permissions.append(permission)
        group = await self.repository.update(group, **marshal(group))

        return GroupPermission(group=group, permission=permission)

    def add_member(self, group: Group, member):
        group.members.add(member)
        self.repository.update(group, **marshal(group))

    def remove_member(self, group: Group, member):
        group.members.remove(member)
        self.repository.update(group, **marshal(group))

    def add_perm(self, group: Group, perm):
        group.permissions.add(perm)
        self.repository.update(group, **marshal(group))

    def remove_perm(self, group: Group, perm):
        group.permissions.remove(perm)
        self.repository.update(group, **marshal(group))


class PermissionService(BaseService[Permission], IPermissionService):
    ...
