from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from beak.core.config import ROOT_DIR
from beak.core.config import settings

_MIGRATIONS_DIR = Path(ROOT_DIR) / "beak" / "migrations"
_VERSIONS_DIR = str(_MIGRATIONS_DIR / "versions")
_PLATFORM_DIR = str(_MIGRATIONS_DIR / "platform")


class BeakMigrator:
    def __init__(self, config_path: str = f"{ROOT_DIR}/alembic.ini") -> None:
        self.alembic_cfg = Config(config_path)
        self.database_url = settings.SQLALCHEMY_DATABASE_URI

    def upgrade(self, revision: str = "head") -> None:
        # Without TENANT_SCHEMA, env.py routes to platform migrations.
        # Restrict version_locations so ScriptDirectory only sees platform revisions.
        self.alembic_cfg.set_main_option("version_locations", _PLATFORM_DIR)
        command.upgrade(self.alembic_cfg, revision)

    def downgrade(self, revision: str) -> None:
        self.alembic_cfg.set_main_option("version_locations", _PLATFORM_DIR)
        command.downgrade(self.alembic_cfg, revision)

    def create_revision(self, message: str, scope: str = "tenant", autogenerate: bool = True) -> None:
        if scope == "platform":
            version_path = _PLATFORM_DIR
        else:
            version_path = _VERSIONS_DIR

        # Restrict version_locations so Alembic's ScriptDirectory only sees
        # the relevant folder and doesn't confuse cross-scope heads.
        self.alembic_cfg.set_main_option("version_locations", version_path)

        command.revision(
            self.alembic_cfg,
            message=message,
            autogenerate=autogenerate,
            version_path=version_path,
        )

    def current(self) -> None:
        command.current(self.alembic_cfg)

    def history(self) -> None:
        command.history(self.alembic_cfg)

    async def get_current_db_revision(self) -> str | None:
        engine = create_async_engine(self.database_url)
        async with engine.connect() as connection:
            result = await connection.execute(
                text(
                    f'SELECT version_num FROM "{settings.PLATFORM_SCHEMA}".alembic_version'
                )
            )
        return result.scalar()

    async def get_latest_revision(self) -> str | None:
        script = ScriptDirectory.from_config(self.alembic_cfg)
        return script.get_current_head()

    async def check_for_updates(self) -> None:
        current_revision = await self.get_current_db_revision()
        latest_revision = await self.get_latest_revision()

        if current_revision != latest_revision:
            print("Database is not up-to-date!")
            print(f"Current revision: {current_revision}")
            print(f"Latest revision: {latest_revision}")
            print("You should run the Alembic upgrade.")
        else:
            print("Database is up-to-date.")
