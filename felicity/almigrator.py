from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import text
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import create_async_engine

from felicity.core.config import ROOT_DIR
from felicity.core.config import settings


class FelicityMigrator:
    def __init__(self, config_path: str = f"{ROOT_DIR}/alembic.ini") -> None:
        self.alembic_cfg = Config(config_path)
        self.database_url = settings.SQLALCHEMY_DATABASE_URI

    def upgrade(self, revision: str = "head") -> None:
        command.upgrade(self.alembic_cfg, revision)

    def downgrade(self, revision: str) -> None:
        command.downgrade(self.alembic_cfg, revision)

    def create_revision(self, message: str) -> None:
        command.revision(self.alembic_cfg, message=message)

    def current(self) -> None:
        command.current(self.alembic_cfg)

    def history(self) -> None:
        command.history(self.alembic_cfg)

    async def get_current_db_revision(self) -> str | None:
        engine = create_async_engine(self.database_url)
        async with engine.connect() as connection:
            result: CursorResult = await connection.execute(
                text("SELECT version_num FROM alembic_version")
            )
        return result.scalar()

    async def get_latest_revision(self) -> str | None:
        script = ScriptDirectory.from_config(self.alembic_cfg)
        return script.get_current_head()

    async def check_for_updates(self) -> None:
        # Get current and latest revisions
        current_revision = await self.get_current_db_revision()
        latest_revision = await self.get_latest_revision()

        if current_revision != latest_revision:
            print("Database is not up-to-date!")
            print(f"Current revision: {current_revision}")
            print(f"Latest revision: {latest_revision}")
            print("You should run the Alembic upgrade.")
            # Optionally, you can call `run_alembic_upgrade()` here to auto-upgrade.
        else:
            print("Database is up-to-date.")
