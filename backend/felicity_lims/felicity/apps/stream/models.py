import logging
from typing import Optional, List, Any

from sqlalchemy import Column, String, ForeignKey, Table, Integer
from sqlalchemy.orm import relationship

from felicity.apps.user.models import User
from . import schemas
from felicity.apps import BaseAuditDBModel, DBModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between Users and ActivityFeed
"""
activity_feed_subscription = Table('activity_feed_subscription', DBModel.metadata,
                                   Column("activity_feed_uid", ForeignKey('activityfeed.uid'), primary_key=True),
                                   Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                                   )


class ActivityFeed(BaseAuditDBModel):
    """ActivityFeed"""
    name = Column(String, nullable=False)
    subscribers = relationship('User', secondary=activity_feed_subscription, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.ActivityFeedCreate) -> schemas.ActivityFeed:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ActivityFeedUpdate) -> schemas.ActivityFeed:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_subscribers(self) -> schemas.ActivityFeed:
        self.subscribers.clear()
        return await self.save()

    async def remove_subscriber(self, user: User) -> schemas.ActivityFeed:
        self.subscribers.remove(user)
        return await self.save()

    async def add_subscriber(self, user: User) -> schemas.ActivityFeed:
        if user not in self.viewers:
            self.subscribers.append(user)
            return await self.save()
        return self


"""
 Many to Many Link between ActivityStream and ActivityFeed
"""
activity_stream_feed = Table('activity_stream_feed', DBModel.metadata,
                             Column("activity_feed_uid", ForeignKey('activityfeed.uid'), primary_key=True),
                             Column("stream_uid", ForeignKey('activitystream.uid'), primary_key=True)
                             )

"""
 Many to Many Link between Users and ActivityStream
"""
activity_stream_view = Table('activity_stream_view', DBModel.metadata,
                             Column("activity_stream_uid", ForeignKey('activitystream.uid'), primary_key=True),
                             Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                             )


class ActivityStream(BaseAuditDBModel):
    """ActivityStream
    Actor. The object that performed the activity.
    Verb. The verb phrase that identifies the action of the activity.
    Action Object. (Optional) The object linked to the action itself.
    Target. (Optional) The object to which the activity was performed.
    e.g. Aurthur (actor) verified (verb) worksheet ws20-1222 (action object) 20 on felicity lims (target) minutes ago
    ?? maybe target as feed
    """
    feeds = relationship(ActivityFeed, secondary=activity_stream_feed, lazy="selectin")
    actor_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    actor = relationship('User', foreign_keys=[actor_uid], lazy='selectin')
    verb = Column(String, nullable=True)
    action_object_type = Column(String, nullable=True)
    action_object_uid = Column(Integer, nullable=True)
    action_object = Column(String, nullable=True)
    target_uid = Column(Integer, nullable=True)
    target = Column(String, nullable=True)
    viewers = relationship('User', secondary=activity_stream_view, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.ActivityStreamCreate) -> schemas.ActivityStream:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ActivityStreamUpdate) -> schemas.ActivityStream:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_feeds(self) -> schemas.ActivityStream:
        self.feeds.clear()
        return await self.save()

    async def remove_feed(self, feed: ActivityFeed) -> schemas.ActivityStream:
        self.feeds.remove(feed)
        return await self.save()

    async def add_feed(self, feed: ActivityFeed) -> schemas.ActivityStream:
        if feed not in self.feeds:
            self.feeds.append(feed)
            return await self.save()
        return self

    async def reset_viewers(self) -> schemas.ActivityStream:
        self.viewers.clear()
        return await self.save()

    async def remove_viewer(self, viewer: User) -> schemas.ActivityStream:
        self.viewers.remove(viewer)
        return await self.save()

    async def add_viewer(self, viewer: User) -> schemas.ActivityStream:
        if viewer not in self.viewers:
            self.viewers.append(viewer)
            return await self.save()
        return self

    async def not_viewed(self, activity_uid) -> Optional[List[User]]:
        """list of users who have not seen the stream"""
        pass

    @classmethod
    async def for_viewer(cls, viewer: User, seen=False) -> Optional[List[schemas.ActivityStream]]:
        """Streams for user: seen or unseen"""
        pass

    @classmethod
    async def stream(cls, obj: Any, actor: User, verb: str, object_type: str, feeds: List[ActivityFeed] = None):
        if feeds is None:
            feeds = []
        s_in = schemas.ActivityStreamCreate(
            feeds=feeds,
            actor_uid=actor.uid,
            verb=verb,
            action_object_type=object_type,
            action_object_uid=obj.uid,
            target_uid=None,
        )
        _stream = await cls.create(s_in)
