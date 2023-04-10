import logging
from typing import Optional

from apps.user import models, schemas
from core.config import settings
from init.setup.groups_perms import FGroup
from utils.email.email import send_new_account_email

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_daemon_user() -> None:
    logger.info(f"Setting up system-daemon - System Daemon - .....")

    system_daemon: Optional[models.User] = await models.User.get_by_email(
        settings.SYSTEM_DAEMONUSER_EMAIL
    )
    if not system_daemon:
        su_in = schemas.UserCreate(
            first_name="System",
            last_name="Daemon",
            email=settings.SYSTEM_DAEMONUSER_EMAIL,
            is_superuser=True,
        )
        system_daemon = await models.User.create(user_in=su_in)

        admin_group = await models.Group.get(name=FGroup.ADMINISTRATOR)
        if admin_group:
            system_daemon.groups.append(admin_group)
            await system_daemon.save()

        if not system_daemon:
            raise Exception("Failed to create system_daemon")

        su_auth: Optional[models.UserAuth] = await models.UserAuth.get_by_username(
            settings.SYSTEM_DAEMONUSER_USERNAME
        )
        if not su_auth:
            sua_in = schemas.AuthCreate(
                user_name=settings.SYSTEM_DAEMONUSER_USERNAME,
                password=settings.SYSTEM_DAEMONUSER_PASSWORD,
                login_retry=0,
            )
            su_auth = await models.UserAuth.create(sua_in)  # noqa
            if not su_auth:
                raise Exception("Failed to add authentication to superuser")

            await system_daemon.link_auth(auth_uid=su_auth.uid)
            await system_daemon.propagate_user_type()

        # initial user-preferences
        pref_in = schemas.UserPreferenceCreate(expanded_menu=False, theme="light")
        preference = await models.UserPreference.create(obj_in=pref_in)
        logger.info(
            f"linking system daemon {system_daemon.uid} to preference {preference.uid}"
        )
        await system_daemon.link_preference(preference_uid=preference.uid)

    logger.info(f"Done Setting up system daemon {system_daemon.marshal_simple()}")


async def create_super_user() -> None:
    logger.info(f"Setting up first superuser - System Administrator - .....")

    superuser: Optional[models.User] = await models.User.get_by_email(
        settings.FIRST_SUPERUSER_EMAIL
    )
    if not superuser:
        su_in = schemas.UserCreate(
            first_name="System",
            last_name="Administrator",
            email=settings.FIRST_SUPERUSER_EMAIL,
            is_superuser=True,
        )
        superuser = await models.User.create(user_in=su_in)

        admin_group = await models.Group.get(name=FGroup.ADMINISTRATOR)
        if admin_group:
            superuser.groups.append(admin_group)
            await superuser.save()

        if not superuser:
            raise Exception("Failed to create superuser")

        su_auth: Optional[models.UserAuth] = await models.UserAuth.get_by_username(
            settings.FIRST_SEPERUSER_USERNAME
        )
        if not su_auth:
            sua_in = schemas.AuthCreate(
                user_name=settings.FIRST_SEPERUSER_USERNAME,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                login_retry=0,
            )
            su_auth = await models.UserAuth.create(sua_in)  # noqa
            if not su_auth:
                raise Exception("Failed to add authentication to superuser")

            await superuser.link_auth(auth_uid=su_auth.uid)
            await superuser.propagate_user_type()

        # initial user-preferences
        pref_in = schemas.UserPreferenceCreate(expanded_menu=False, theme="light")
        preference = await models.UserPreference.create(obj_in=pref_in)
        logger.info(
            f"linking super user {superuser.uid} to preference {preference.uid}"
        )
        await superuser.link_preference(preference_uid=preference.uid)

        send_new_account_email(
            settings.FIRST_SUPERUSER_EMAIL,
            settings.FIRST_SEPERUSER_USERNAME,
            settings.FIRST_SUPERUSER_PASSWORD,
        )

    logger.info(f"Done Setting up first superuser {superuser.marshal_simple()}")
