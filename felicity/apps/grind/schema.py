from datetime import datetime

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.grind.enum import PosterCategory, ErrandCategory, LabelCategory, MediaTarget, OccurrenceTarget, \
    StampCategory


#
# GrindScheme Schemas
#

# Shared properties
class GrindSchemeBase(BaseAuditModel):
    title: str | None = None
    description: str | None = None
    assignee_uid: int | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class GrindSchemeBaseInDB(GrindSchemeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindSchemeCreate(GrindSchemeBase):
    title: str


# Properties to receive via API on update
class GrindSchemeUpdate(GrindSchemeBase):
    pass


# Properties to return via API
class GrindScheme(GrindSchemeBaseInDB):
    pass


# Properties stored in DB
class GrindSchemeInDB(GrindSchemeBaseInDB):
    pass


#
# GrindBoard Schemas
#

# Shared properties
class GrindBoardBase(BaseAuditModel):
    title: str | None = None
    description: str | None = None
    scheme_uid: int | None = None


class GrindBoardBaseInDB(GrindBoardBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindBoardCreate(GrindBoardBase):
    title: str


# Properties to receive via API on update
class GrindBoardUpdate(GrindBoardBase):
    pass


# Properties to return via API
class GrindBoard(GrindBoardBaseInDB):
    pass


# Properties stored in DB
class GrindBoardInDB(GrindBoardBaseInDB):
    pass


#
# GrindPoster Schemas
#

# Shared properties
class GrindPosterBase(BaseAuditModel):
    category: PosterCategory | None = None
    title: str | None = None
    description: str | None = None
    board_uid: int | None = None
    assignee_uid: int | None = None
    status: str | None = None


class GrindPosterBaseInDB(GrindPosterBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindPosterCreate(GrindPosterBase):
    title: str


# Properties to receive via API on update
class GrindPosterUpdate(GrindPosterBase):
    pass


# Properties to return via API
class GrindPoster(GrindPosterBaseInDB):
    pass


# Properties stored in DB
class GrindPosterInDB(GrindPosterBaseInDB):
    pass


#
# GrindErrand Schemas
#

# Shared properties
class GrindErrandBase(BaseAuditModel):
    category: ErrandCategory | None = None
    title: str | None = None
    description: str | None = None
    label_uid: int | None = None
    priority: str | None = "normal"
    poster_uid: int | None = None
    reporter_uid: int | None = None
    assignee_uid: int | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    progress: int | None = None


class GrindErrandBaseInDB(GrindErrandBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindErrandCreate(GrindErrandBase):
    title: str


# Properties to receive via API on update
class GrindErrandUpdate(GrindErrandBase):
    pass


# Properties to return via API
class GrindErrand(GrindErrandBaseInDB):
    pass


# Properties stored in DB
class GrindErrandInDB(GrindErrandBaseInDB):
    pass


#
# GrindLabel Schemas
#

# Shared properties
class GrindLabelBase(BaseAuditModel):
    title: str | None = None
    category: LabelCategory | None = None


class GrindLabelBaseInDB(GrindLabelBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindLabelCreate(GrindLabelBase):
    title: str


# Properties to receive via API on update
class GrindLabelUpdate(GrindLabelBase):
    pass


# Properties to return via API
class GrindLabel(GrindLabelBaseInDB):
    pass


# Properties stored in DB
class GrindLabelInDB(GrindLabelBaseInDB):
    pass


#
# GrindStamp Schemas
#

# Shared properties
class GrindStampBase(BaseAuditModel):
    title: str | None = None
    category: StampCategory | None = None


class GrindStampBaseInDB(GrindStampBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindStampCreate(GrindStampBase):
    title: str


# Properties to receive via API on update
class GrindStampUpdate(GrindStampBase):
    pass


# Properties to return via API
class GrindStamp(GrindStampBaseInDB):
    pass


# Properties stored in DB
class GrindStampInDB(GrindStampBaseInDB):
    pass


#
# GrindMedia Schemas
#

# Shared properties
class GrindMediaBase(BaseAuditModel):
    target: MediaTarget | None = None
    target_uid: str | None = None
    destination: str | None = None
    encoding: str | None = None
    filename: str | None = None
    mimetype: str | None = None
    original_name: str | None = None
    path: str | None = None
    size: str | None = None
    description: str | None = None


class GrindMediaBaseInDB(GrindMediaBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindMediaCreate(GrindMediaBase):
    pass


# Properties to receive via API on update
class GrindMediaUpdate(GrindMediaBase):
    pass


# Properties to return via API
class GrindMedia(GrindMediaBaseInDB):
    pass


# Properties stored in DB
class GrindMediaInDB(GrindMediaBaseInDB):
    pass


#
# GrindMilestone Schemas
#

# Shared properties
class GrindMilestoneBase(BaseAuditModel):
    errand_uid: str | None = None
    title: str | None = None
    description: str | None = None
    complete: bool | None = False
    assignee_uid: str | None = None


class GrindMilestoneBaseInDB(GrindMilestoneBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindMilestoneCreate(GrindMilestoneBase):
    title: str


# Properties to receive via API on update
class GrindMilestoneUpdate(GrindMilestoneBase):
    pass


# Properties to return via API
class GrindMilestone(GrindMilestoneBaseInDB):
    pass


# Properties stored in DB
class GrindMilestoneInDB(GrindMilestoneBaseInDB):
    pass


#
# GrindOccurrence Schemas
#

# Shared properties
class GrindOccurrenceBase(BaseAuditModel):
    target: OccurrenceTarget | None = None
    target_uid: str | None = None
    actor_uid: str | None = None
    description: str | None = None


class GrindOccurrenceBaseInDB(GrindOccurrenceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class GrindOccurrenceCreate(GrindOccurrenceBase):
    target: OccurrenceTarget
    target_uid: str


# Properties to receive via API on update
class GrindOccurrenceUpdate(GrindOccurrenceBase):
    pass


# Properties to return via API
class GrindOccurrence(GrindOccurrenceBaseInDB):
    pass


# Properties stored in DB
class GrindOccurrenceInDB(GrindOccurrenceBaseInDB):
    pass
