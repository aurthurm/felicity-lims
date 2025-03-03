from datetime import timezone, timedelta, datetime

from felicity.apps.abstract import BaseService
from felicity.apps.app.entities import APPActivityLog
from felicity.apps.app.repositories import APPActivityLogRepository
from felicity.apps.app.schemas import APPActivityLogCreate, APPActivityLogUpdate
from felicity.apps.setup.caches import get_system_daemon


class APPActivityLogService(BaseService[APPActivityLog, APPActivityLogCreate, APPActivityLogUpdate]):
    def __init__(self) -> None:
        super().__init__(APPActivityLogRepository())

    async def delete_logs(self):
        # Get the logs older than 30 days to delete
        await self.delete_where(
            created_at__le=datetime.now(timezone.utc) - timedelta(days=30)
        )

    async def create(self, c: APPActivityLogCreate | dict, related: list[str] | None = None):
        system_daemon = await get_system_daemon()
        if isinstance(c, dict):
            c["created_by_uid"] = system_daemon.uid
            c["updated_by_uid"] = system_daemon.uid
        else:
            c.created_by_uid = system_daemon.uid
            c.updated_by_uid = system_daemon.uid
        return await super().create(c=c, related=related)
