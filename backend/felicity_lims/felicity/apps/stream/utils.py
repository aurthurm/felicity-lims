import logging
from typing import Any

from felicity.apps.core.channel import broadcast
from felicity.apps.stream.models import ActivityStream
from felicity.apps.stream.schemas import ActivityStreamCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FelicityStreamer:
    """streams utils"""

    @staticmethod
    async def stream(obj: Any, actor: Any, verb: str, object_type: str):
        s_in = ActivityStreamCreate(
            feeds=[],
            actor_uid=actor.uid,
            verb=verb,
            action_object_type=object_type,
            action_object_uid=obj.uid,
            target_uid=None,
        )
        stream = await ActivityStream.create(s_in)
        await broadcast.publish("activities", stream)
