from __future__ import annotations

from sqlalchemy import Column, String, ForeignKey, Table, DateTime, Boolean, Enum, Integer
from sqlalchemy.orm import relationship, backref

from felicity.apps.abstract import LabScopedEntity
from felicity.apps.grind.enum import MediaTarget, LabelCategory, ErrandCategory, PosterCategory, OccurrenceTarget, \
    StampCategory

# Association table for many-to-many relationship between Scheme and User (members)
grind_scheme_member = Table(
    'grind_scheme_member',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('grind_scheme_uid', String, ForeignKey('grind_scheme.uid')),
    Column('user_uid', String, ForeignKey('user.uid'))
)


class GrindScheme(LabScopedEntity):
    __tablename__ = 'grind_scheme'

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # Foreign key relationship to User (assignee)
    assignee_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    assignee = relationship("User", foreign_keys=[assignee_uid], lazy='selectin')

    # Many-to-many relationship with User (members)
    members = relationship("User", secondary=grind_scheme_member, backref="scheme_memberships", lazy='selectin')

    # One-to-many relationship with Board
    boards = relationship("GrindBoard", back_populates="scheme", lazy='selectin')

    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)


class GrindBoard(LabScopedEntity):
    __tablename__ = 'grind_board'

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # Foreign key relationship to Scheme
    scheme_uid = Column(String, ForeignKey('grind_scheme.uid'), nullable=True, unique=False)
    scheme = relationship("GrindScheme", back_populates="boards", lazy='selectin')


# Association table for many-to-many relationship between Poster and User (members)
grind_poster_member = Table(
    'grind_poster_member',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('grind_poster_uid', String, ForeignKey('grind_poster.uid')),
    Column('user_uid', String, ForeignKey('user.uid'))
)

# Association table for many-to-many relationship between Poster and Stamp
grind_poster_stamp = Table(
    'grind_poster_stamp',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('grind_poster_uid', String, ForeignKey('grind_poster.uid')),
    Column('grind_stamp_uid', String, ForeignKey('grind_stamp.uid'))
)


class GrindPoster(LabScopedEntity):
    __tablename__ = 'grind_poster'

    category = Column(Enum(PosterCategory), nullable=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)

    # Foreign key relationship to Board
    board_uid = Column(String, ForeignKey('grind_board.uid'), nullable=True)
    board = relationship("GrindBoard", lazy='selectin')

    # Many-to-many relationship with Stamp
    stamps = relationship("GrindStamp", secondary=grind_poster_stamp, backref="posters", lazy='selectin')

    # Foreign key relationship to User (assignee)
    assignee_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    assignee = relationship("User", foreign_keys=[assignee_uid], lazy='selectin')

    # Many-to-many relationship with User (members)
    members = relationship("User", secondary=grind_poster_member, backref="poster_memberships", lazy='selectin')

    status = Column(String, nullable=True)

    # One-to-many relationship with Errand
    errands = relationship("GrindErrand", back_populates="poster", lazy='selectin')


# Association table for many-to-many relationship between Errand and User (members)
grind_errand_member = Table(
    'grind_errand_member',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('grind_errand_uid', String, ForeignKey('grind_errand.uid')),
    Column('grind_user_uid', String, ForeignKey('user.uid'))
)

# Association table for many-to-many relationship between Errand and Stamp
grind_errand_stamp = Table(
    'grind_errand_stamp',
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column('grind_errand_uid', String, ForeignKey('grind_errand.uid')),
    Column('grind_stamp_uid', String, ForeignKey('grind_stamp.uid'))
)


class GrindErrand(LabScopedEntity):
    __tablename__ = 'grind_errand'

    category = Column(Enum(ErrandCategory), nullable=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)

    # Many-to-many relationship with Stamp
    stamps = relationship("GrindStamp", secondary=grind_errand_stamp, backref="errands", lazy='selectin')

    # Foreign key relationship to Label
    label_uid = Column(String, ForeignKey('grind_label.uid'), nullable=True)
    label = relationship("GrindLabel", lazy='selectin')

    priority = Column(String, default="normal", nullable=True)

    # Foreign key relationship to Poster
    poster_uid = Column(String, ForeignKey('grind_poster.uid'), nullable=True)
    poster = relationship("GrindPoster", back_populates="errands", lazy='selectin')

    # Foreign key relationship to User (reporter)
    reporter_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    reporter = relationship("User", foreign_keys=[reporter_uid], lazy='selectin')

    # Foreign key relationship to User (assignee)
    assignee_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    assignee = relationship("User", foreign_keys=[assignee_uid], lazy='selectin')

    # Many-to-many relationship with User (members)
    members = relationship("User", secondary=grind_errand_member, backref="errand_memberships", lazy='selectin')

    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

    progress = Column(Integer, nullable=True)


class GrindErrandDiscussion(LabScopedEntity):
    __tablename__ = 'grind_errand_discussion'

    comment = Column(String)
    errand_uid = Column(String, ForeignKey('grind_errand.uid'), nullable=True)
    errand = relationship("GrindErrand", backref="discussions", lazy='selectin')
    parent_uid = Column(String, ForeignKey('grind_errand_discussion.uid'), nullable=True)
    parent = relationship("GrindErrandDiscussion",
                          remote_side="GrindErrandDiscussion.uid",
                          backref=backref("subdiscussions", lazy='select'))


class GrindLabel(LabScopedEntity):
    __tablename__ = 'grind_label'

    title = Column(String, nullable=False)
    category = Column(Enum(LabelCategory), nullable=True)


class GrindMedia(LabScopedEntity):
    __tablename__ = 'grind_media'

    target = Column(Enum(MediaTarget), nullable=True)
    target_uid = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    encoding = Column(String, nullable=True)
    filename = Column(String, nullable=True)
    mimetype = Column(String, nullable=True)
    original_name = Column(String, nullable=True)
    path = Column(String, nullable=True)
    size = Column(String, nullable=True)
    description = Column(String, nullable=True)


class GrindMilestone(LabScopedEntity):
    __tablename__ = 'grind_milestone'

    # Foreign key relationship to Errand
    errand_uid = Column(String, ForeignKey('grind_errand.uid'), nullable=True)
    errand = relationship("GrindErrand", backref="milestones", lazy='selectin')

    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    complete = Column(Boolean, default=False, nullable=True)

    # Foreign key relationship to User (assignee)
    assignee_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    assignee = relationship("User", foreign_keys=[assignee_uid], lazy='selectin')


class GrindOccurrence(LabScopedEntity):
    __tablename__ = 'grind_occurrence'

    target = Column(Enum(OccurrenceTarget), nullable=True)
    target_uid = Column(String, nullable=True)

    # Foreign key relationship to User (actor)
    actor_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    actor = relationship("User", foreign_keys=[actor_uid], lazy='selectin')

    description = Column(String, nullable=True)


class GrindStamp(LabScopedEntity):
    __tablename__ = 'grind_stamp'

    title = Column(String, nullable=False)
    category = Column(Enum(StampCategory), nullable=True)
