import json
import logging
from typing import AsyncGenerator

import strawberry  # noqa

from felicity.api.gql.notification.types import ActivityStreamType, ActivityProcessType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.common.channel import broadcast
from felicity.apps.notification.enum import NotificationChannel
from felicity.apps.notification.services import ActivityStreamService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class StreamSubscription:
    @strawberry.subscription(permission_classes=[IsAuthenticated])
    async def latest_activity(self) -> AsyncGenerator[ActivityStreamType, None]:  # noqa
        async with broadcast.subscribe(
                channel=NotificationChannel.ACTIVITIES
        ) as subscriber:
            logger.info("Subscribed to activities")
            try:
                async for event in subscriber:
                    logger.info(event)
                    yield ActivityStreamType(**json.loads(event.message))
            finally:
                logger.info("Unsubscribed from activities")

    @strawberry.subscription(permission_classes=[IsAuthenticated])
    async def stream_all(self) -> AsyncGenerator[ActivityStreamType, None]:  # noqa
        streams = await ActivityStreamService().all()
        for stream in streams:
            yield stream

    @strawberry.subscription(permission_classes=[IsAuthenticated])
    async def stream_processes(self) -> AsyncGenerator[ActivityProcessType, None]:  # noqa
        async with broadcast.subscribe(
                channel=NotificationChannel.PROCESSING
        ) as subscriber:
            logger.info("Subscribed to processes")
            try:
                async for event in subscriber:
                    logger.info(event)
                    yield ActivityProcessType(**json.loads(event.message))
            finally:
                logger.info("Unsubscribed from processes")
