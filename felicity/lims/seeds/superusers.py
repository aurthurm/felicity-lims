import logging

from felicity.apps.guard.definitions import FGroup
from felicity.apps.user import schemas
from felicity.apps.user.services import GroupService, UserPreferenceService, UserService
from felicity.core.config import get_settings

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_daemon_user() -> None:
    logger.info("Setting up system-daemon - System Daemon - .....")
    user_service = UserService()
    group_service = GroupService()
    preference_service = UserPreferenceService()

    system_daemon = await user_service.get(
        related=["groups"], email=settings.SYSTEM_DAEMON_EMAIL
    )
    if not system_daemon:
        su_in = schemas.UserCreate(
            first_name="System",
            last_name="Daemon",
            user_name=settings.SYSTEM_DAEMON_USERNAME,
            password=settings.SYSTEM_DAEMON_PASSWORD,
            email=settings.SYSTEM_DAEMON_EMAIL,
            login_retry=0,
            is_superuser=True,
        )
        system_daemon = await user_service.create(user_in=su_in, related=["groups"])

    admin_group = await group_service.get(name=FGroup.ADMINISTRATOR)

    if admin_group.uid not in [g.uid for g in system_daemon.groups]:
        system_daemon.groups.append(admin_group)
        await user_service.save(system_daemon)

    # initial user-preferences
    preference = await preference_service.get(user_uid=system_daemon.uid)
    if not preference:
        pref_in = schemas.UserPreferenceCreate(user_uid=system_daemon.uid, expanded_menu=False, theme="light")
        await preference_service.create(pref_in)

    logger.info("Done Setting up system daemon")


async def seed_super_user() -> None:
    logger.info("Setting up super user - Felicity User - .....")
    user_service = UserService()
    group_service = GroupService()
    preference_service = UserPreferenceService()

    super_user = await user_service.get(
        related=["groups"], email=settings.FIRST_SUPERUSER_EMAIL
    )
    if not super_user:
        su_in = schemas.UserCreate(
            first_name="System",
            last_name="Admin",
            user_name=settings.FIRST_SUPERUSER_USERNAME,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            email=settings.FIRST_SUPERUSER_EMAIL,
            login_retry=0,
            is_superuser=True,
        )
        super_user = await user_service.create(user_in=su_in, related=["groups"])

    admin_group = await group_service.get(name=FGroup.ADMINISTRATOR)
    if admin_group and admin_group.uid not in [g.uid for g in super_user.groups]:
        super_user.groups.append(admin_group)
        await user_service.save(super_user)

    # initial user-preferences
    preference = await preference_service.get(user_uid=super_user.uid)
    if not preference:
        pref_in = schemas.UserPreferenceCreate(user_uid=super_user.uid, expanded_menu=False, theme="light")
        await preference_service.create(pref_in)

    logger.info("Done Setting up system admin")
