import sqlalchemy as sa

from felicity.apps.user.entities import (
    User,
    Permission,
    Group,
    UserAuth,
    UserPreference,
)
from felicity.database.paging import PageCursor
from felicity.database.repository import BaseRepository



class UserAuthRepository(BaseRepository[UserAuth]):
    def __init__(self) -> None:
        super().__init__(UserAuth)

class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:
        filters = {}

        _or_ = dict()
        if text:
            arg_list = [
                "first_name__ilike",
                "last_name__ilike",
                "email__ilike",
                "mobile_phone__ilike",
                "business_phone__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class PermissionRepository(BaseRepository[Permission]):
    def __init__(self) -> None:
        super().__init__(Permission)


class GroupRepository(BaseRepository[Group]):
    def __init__(self) -> None:
        super().__init__(Group)



class UserPreferenceRepository(BaseRepository[UserPreference]):
    def __init__(self) -> None:
        super().__init__(UserPreference)
