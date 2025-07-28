from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.user.entities import Group, Permission, User, UserPreference


class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    async def get_users_by_laboratory(self, laboratory_uid: str) -> list[User]:
        """Get all users assigned to a specific laboratory"""
        from felicity.apps.user.entities import laboratory_user
        user_uids = await self.table_query(
            table=laboratory_user,
            columns=["user_uid"],
            laboratory_uid=laboratory_uid
        )
        return await self.get_by_uids(user_uids) if user_uids else []

    async def get_laboratories_by_user(self, user_uid: str) -> list[str]:
        """Get all laboratory UIDs a user has access to"""
        from felicity.apps.user.entities import laboratory_user
        return await self.table_query(
            table=laboratory_user,
            columns=["laboratory_uid"],
            user_uid=user_uid
        )

    async def assign_user_to_laboratory(self, user_uid: str, laboratory_uid: str) -> None:
        """Assign a user to a laboratory"""
        from felicity.apps.user.entities import laboratory_user
        from felicity.database.session import async_session
        
        # Check if assignment already exists
        existing = await self.table_query(
            table=laboratory_user,
            columns=["user_uid"],
            user_uid=user_uid,
            laboratory_uid=laboratory_uid
        )
        
        if not existing:
            async with async_session() as session:
                await session.execute(
                    laboratory_user.insert().values(
                        user_uid=user_uid,
                        laboratory_uid=laboratory_uid
                    )
                )
                await session.commit()

    async def remove_user_from_laboratory(self, user_uid: str, laboratory_uid: str) -> None:
        """Remove a user from a laboratory"""
        from felicity.apps.user.entities import laboratory_user
        from felicity.database.session import async_session
        
        async with async_session() as session:
            await session.execute(
                laboratory_user.delete().where(
                    laboratory_user.c.user_uid == user_uid,
                    laboratory_user.c.laboratory_uid == laboratory_uid
                )
            )
            await session.commit()

    async def search_users(
        self, text: str, laboratory_uid: str = None, limit: int = 10
    ) -> list[User]:
        """Search users by text in name, email, or username"""
        filters = {
            "or": {
                "first_name__ilike": f"%{text}%",
                "last_name__ilike": f"%{text}%",
                "email__ilike": f"%{text}%",
                "user_name__ilike": f"%{text}%",
            }
        }
        
        if laboratory_uid:
            # If laboratory filter is provided, get users for that lab
            lab_users = await self.get_users_by_laboratory(laboratory_uid)
            user_uids = [user.uid for user in lab_users]
            if user_uids:
                filters["uid__in"] = user_uids
            else:
                return []  # No users in this lab
        
        return await self.get_all(**filters, limit__exact=limit)

    async def get_user_by_email_or_username(self, identifier: str) -> User | None:
        """Get user by email or username"""
        user = await self.get(email=identifier)
        if not user:
            user = await self.get(user_name=identifier)
        return user


class PermissionRepository(BaseRepository[Permission]):
    def __init__(self) -> None:
        super().__init__(Permission)

    async def get_permissions_by_action_target(self, action: str, target: str) -> list[Permission]:
        """Get permissions by action and target"""
        return await self.get_all(action__exact=action, target__exact=target)

    async def get_permissions_by_action(self, action: str) -> list[Permission]:
        """Get all permissions for a specific action"""
        return await self.get_all(action__exact=action)

    async def get_permissions_by_target(self, target: str) -> list[Permission]:
        """Get all permissions for a specific target object"""
        return await self.get_all(target__exact=target)

    async def search_permissions(self, text: str, limit: int = 10) -> list[Permission]:
        """Search permissions by text in action or target"""
        filters = {
            "or": {
                "action__ilike": f"%{text}%",
                "target__ilike": f"%{text}%",
            }
        }
        return await self.get_all(**filters, limit__exact=limit)


class GroupRepository(BaseRepository[Group]):
    def __init__(self) -> None:
        super().__init__(Group)

    async def get_groups_by_laboratory(self, laboratory_uid: str = None) -> list[Group]:
        """Get all groups for a specific laboratory or global groups"""
        if laboratory_uid:
            return await self.get_all(laboratory_uid__exact=laboratory_uid)
        else:
            # Get global groups (no laboratory association)
            return await self.get_all(laboratory_uid__isnull=True)

    async def get_group_by_name(self, name: str, laboratory_uid: str = None) -> Group | None:
        """Get group by name within laboratory scope"""
        filters = {"name__exact": name}
        if laboratory_uid:
            filters["laboratory_uid__exact"] = laboratory_uid
        else:
            filters["laboratory_uid__isnull"] = True
        return await self.get(**filters)

    async def get_groups_with_permission(self, permission_uid: str, laboratory_uid: str = None) -> list[Group]:
        """Get all groups that have a specific permission"""
        from felicity.apps.user.entities import permission_groups
        
        if laboratory_uid:
            group_uids = await self.table_query(
                table=permission_groups,
                columns=["group_uid"],
                permission_uid=permission_uid,
                laboratory_uid=laboratory_uid
            )
        else:
            group_uids = await self.table_query(
                table=permission_groups,
                columns=["group_uid"],
                permission_uid=permission_uid,
                laboratory_uid=None
            )
        
        return await self.get_by_uids(group_uids) if group_uids else []

    async def search_groups(
        self, text: str, laboratory_uid: str = None, limit: int = 10
    ) -> list[Group]:
        """Search groups by text in name or keyword"""
        filters = {
            "or": {
                "name__ilike": f"%{text}%",
                "keyword__ilike": f"%{text}%",
            }
        }
        
        if laboratory_uid:
            filters["laboratory_uid__exact"] = laboratory_uid
        else:
            filters["laboratory_uid__isnull"] = True
        
        return await self.get_all(**filters, limit__exact=limit)

    async def assign_permission_to_group(
        self, group_uid: str, permission_uid: str, laboratory_uid: str = None
    ) -> None:
        """Assign a permission to a group in a laboratory context"""
        from felicity.apps.user.entities import permission_groups
        from felicity.database.session import async_session
        
        # Check if assignment already exists
        existing = await self.table_query(
            table=permission_groups,
            columns=["group_uid"],
            group_uid=group_uid,
            permission_uid=permission_uid,
            laboratory_uid=laboratory_uid
        )
        
        if not existing:
            async with async_session() as session:
                await session.execute(
                    permission_groups.insert().values(
                        group_uid=group_uid,
                        permission_uid=permission_uid,
                        laboratory_uid=laboratory_uid
                    )
                )
                await session.commit()

    async def remove_permission_from_group(
        self, group_uid: str, permission_uid: str, laboratory_uid: str = None
    ) -> None:
        """Remove a permission from a group in a laboratory context"""
        from felicity.apps.user.entities import permission_groups
        from felicity.database.session import async_session
        
        async with async_session() as session:
            stmt = permission_groups.delete().where(
                permission_groups.c.group_uid == group_uid,
                permission_groups.c.permission_uid == permission_uid
            )
            
            if laboratory_uid:
                stmt = stmt.where(permission_groups.c.laboratory_uid == laboratory_uid)
            else:
                stmt = stmt.where(permission_groups.c.laboratory_uid.is_(None))
                
            await session.execute(stmt)
            await session.commit()


class UserPreferenceRepository(BaseRepository[UserPreference]):
    def __init__(self) -> None:
        super().__init__(UserPreference)
