from felicity.apps.abstract import BaseRepository
from felicity.apps.grind.entities import GrindScheme, GrindBoard, GrindPoster, GrindErrand, GrindLabel, GrindMedia, \
    GrindMilestone, GrindOccurrence, GrindStamp, GrindErrandDiscussion


class GrindSchemeRepository(BaseRepository[GrindScheme]):
    def __init__(self) -> None:
        super().__init__(GrindScheme)


class GrindBoardRepository(BaseRepository[GrindBoard]):
    def __init__(self) -> None:
        super().__init__(GrindBoard)


class GrindPosterRepository(BaseRepository[GrindPoster]):
    def __init__(self) -> None:
        super().__init__(GrindPoster)


class GrindErrandRepository(BaseRepository[GrindErrand]):
    def __init__(self) -> None:
        super().__init__(GrindErrand)


class GrindErrandDiscussionRepository(BaseRepository[GrindErrandDiscussion]):
    def __init__(self) -> None:
        super().__init__(GrindErrandDiscussion)


class GrindLabelRepository(BaseRepository[GrindLabel]):
    def __init__(self) -> None:
        super().__init__(GrindLabel)


class GrindMediaRepository(BaseRepository[GrindMedia]):
    def __init__(self) -> None:
        super().__init__(GrindMedia)


class GrindMilestoneRepository(BaseRepository[GrindMilestone]):
    def __init__(self) -> None:
        super().__init__(GrindMilestone)


class GrindOccurrenceRepository(BaseRepository[GrindOccurrence]):
    def __init__(self) -> None:
        super().__init__(GrindOccurrence)


class GrindStampRepository(BaseRepository[GrindStamp]):
    def __init__(self) -> None:
        super().__init__(GrindStamp)
