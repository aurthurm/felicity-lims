import enum
from typing import List

import strawberry

# Errand Categories
ERRAND_CATEGORIES: List[str] = [
    'message',
    'engagement',
    'ticket',
    'todo',
    'project',
]


@strawberry.enum
class ErrandCategory(enum.Enum):
    MESSAGE = 'message'
    ENGAGEMENT = 'engagement'
    TICKET = 'ticket'
    TODO = 'todo'
    PROJECT = 'project'


# Poster Categories
POSTER_CATEGORIES: List[str] = [
    'listing',
    'engagement',
    'todo',
    'message'
]


@strawberry.enum
class PosterCategory(enum.Enum):
    LISTING = 'listing'
    ENGAGEMENT = 'engagement'
    TODO = 'todo'
    MESSAGE = 'message'


# Occurrence Target
OCCURRENCE_TARGET: List[str] = [
    'errand'
]


class OccurrenceTarget(enum.Enum):
    ERRAND = 'errand'
    MILESTONE = 'milestone'


# Media Target
MEDIA_TARGET: List[str] = [
    'errand'
]


class MediaTarget(enum.Enum):
    ERRAND = 'errand'


# Workflow Targets
WORKFLOW_TARGETS: List[str] = [
    'ticket',
    'todo',
    'poster'
]


class WorkFlowTarget(enum.Enum):
    TICKET = 'ticket'
    TODO = 'todo'
    POSTER = 'poster'


# Label Categories
LABEL_CATEGORIES: List[str] = [
    'ticket'
]


class LabelCategory(enum.Enum):
    TICKET = 'ticket'


# Stamp Categories
STAMP_CATEGORIES: List[str] = [
    'project',
    'ticket'
]


@strawberry.enum
class StampCategory(enum.Enum):
    PROJECT = 'project'
    TICKET = 'ticket'
