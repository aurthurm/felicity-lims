from felicity.apps.user.entities import (
    User,
    Permission,
    Group,
    UserPreference,
)
from felicity.apps.abstract.repository import BaseRepository



class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

class PermissionRepository(BaseRepository[Permission]):
    def __init__(self) -> None:
        super().__init__(Permission)


class GroupRepository(BaseRepository[Group]):
    def __init__(self) -> None:
        super().__init__(Group)



class UserPreferenceRepository(BaseRepository[UserPreference]):
    def __init__(self) -> None:
        super().__init__(UserPreference)
