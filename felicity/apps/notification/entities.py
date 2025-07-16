from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity

"""
 Many to Many Link between Users and ActivityFeed
"""
activity_feed_subscription = Table(
    "activity_feed_subscription",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("activity_feed_uid", ForeignKey("activity_feed.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class ActivityFeed(LabScopedEntity):
    """ActivityFeed"""

    __tablename__ = "activity_feed"

    name = Column(String, nullable=False)
    subscribers = relationship(
        "User", secondary=activity_feed_subscription, lazy="selectin"
    )


"""
 Many to Many Link between ActivityStream and ActivityFeed
"""
activity_stream_feed = Table(
    "activity_stream_feed",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("activity_feed_uid", ForeignKey("activity_feed.uid"), primary_key=True),
    Column("stream_uid", ForeignKey("activity_stream.uid"), primary_key=True),
)

"""
 Many to Many Link between Users and ActivityStream
"""
activity_stream_view = Table(
    "activity_stream_view",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("activity_stream_uid", ForeignKey("activity_stream.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class ActivityStream(LabScopedEntity):
    """ActivityStream
    Actor. The object that performed the activity.
    Verb. The verb phrase that identifies the action of the activity.
    Action Object. (Optional) The object linked to the action itself.
    Target. (Optional) The object to which the activity was performed.
    e.g. Aurthur (actor) verified (verb) worksheet ws20-1222 (action object) 20 on felicity lims (target) minutes ago
    ?? maybe target as feed
    """

    __tablename__ = "activity_stream"

    feeds = relationship(ActivityFeed, secondary=activity_stream_feed, lazy="selectin")
    actor_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    actor = relationship("User", foreign_keys=[actor_uid], lazy="selectin")
    verb = Column(String, nullable=True)
    action_object_type = Column(String, nullable=True)
    action_object_uid = Column(String, nullable=True)
    action_object = Column(String, nullable=True)
    target_uid = Column(String, nullable=True)
    target = Column(String, nullable=True)
    viewers = relationship("User", secondary=activity_stream_view, lazy="selectin")


"""Simple Notifications"""

"""
 Many to Many Link between Users and Notification
"""
user_notification = Table(
    "user_notification",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users and Notification
"""
notification_view = Table(
    "notification_view",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Group and Notification
"""
group_notification = Table(
    "group_notification",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
 Many to Many Link between Department and Notification
"""
department_notification = Table(
    "department_notification",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
)


class Notification(LabScopedEntity):
    """Notification
    Custom messages about system status. These are more like activity streams only that they are very specific
    messages to notify users about something important
    examples:
        32 samples are due in 4 days, today, etc ....
        7 open worksheets have been lying idle for 3 weeks including 137 samples past their due date.
        2 worksheets have no samples, consider populating or deleting them to avoid cluttering your dashboard
        ...
    """

    __tablename__ = "notification"

    # target audiences
    departments = relationship(
        "Department", secondary=department_notification, lazy="selectin"
    )
    groups = relationship("Group", secondary=group_notification, lazy="selectin")
    users = relationship("User", secondary=user_notification, lazy="selectin")
    #
    message = Column(String, nullable=False)
    #
    viewers = relationship("User", secondary=notification_view, lazy="selectin")
