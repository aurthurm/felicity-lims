from felicity.apps.abstract import BaseService
from felicity.apps.grind.entities import GrindScheme, GrindBoard, GrindPoster, GrindErrand, GrindLabel, GrindMedia, \
    GrindMilestone, GrindOccurrence, GrindStamp, grind_errand_member, grind_errand_stamp, grind_poster_stamp, \
    grind_poster_member, grind_scheme_member, GrindErrandDiscussion
from felicity.apps.grind.repositories import GrindSchemeRepository, GrindBoardRepository, GrindPosterRepository, \
    GrindErrandRepository, GrindLabelRepository, GrindMediaRepository, GrindMilestoneRepository, \
    GrindOccurrenceRepository, GrindStampRepository, GrindErrandDiscussionRepository
from felicity.apps.grind.schema import GrindSchemeCreate, GrindSchemeUpdate, GrindBoardCreate, GrindBoardUpdate, \
    GrindPosterCreate, GrindPosterUpdate, GrindErrandCreate, GrindErrandUpdate, GrindLabelCreate, GrindLabelUpdate, \
    GrindMediaCreate, GrindMediaUpdate, GrindMilestoneCreate, GrindMilestoneUpdate, GrindOccurrenceCreate, \
    GrindOccurrenceUpdate, GrindStampCreate, GrindStampUpdate, GrindErrandDiscussionCreate, GrindErrandDiscussionUpdate


class GrindSchemeService(BaseService[GrindScheme, GrindSchemeCreate, GrindSchemeUpdate]):
    def __init__(self):
        super().__init__(GrindSchemeRepository())

    async def add_members(self, uid: str, members: list[str]):
        await self.repository.table_insert(
            grind_scheme_member,
            mappings=[{"grind_scheme_uid": uid, "grind_user_uid": member} for member in members]
        )

    async def update_members(self, uid: str, members: list[str]) -> None:
        await self.repository.delete_table(grind_scheme_member, grind_scheme_uid=uid)
        await self.add_members(uid, members)


class GrindBoardService(BaseService[GrindBoard, GrindBoardCreate, GrindBoardUpdate]):
    def __init__(self):
        super().__init__(GrindBoardRepository())


class GrindPosterService(BaseService[GrindPoster, GrindPosterCreate, GrindPosterUpdate]):
    def __init__(self):
        super().__init__(GrindPosterRepository())

    async def add_members(self, uid: str, members: list[str]):
        await self.repository.table_insert(
            grind_poster_member,
            mappings=[{"grind_poster_uid": uid, "grind_user_uid": member} for member in members]
        )

    async def update_members(self, uid: str, members: list[str]) -> None:
        await self.repository.delete_table(grind_poster_member, grind_poster_uid=uid)
        await self.add_members(uid, members)

    async def add_stamps(self, uid: str, stamps: list[str]):
        await self.repository.table_insert(
            grind_poster_stamp,
            mappings=[{"grind_poster_uid": uid, "grind_stamp_uid": stamp} for stamp in stamps]
        )

    async def update_stamps(self, uid: str, stamps: list[str]) -> None:
        await self.repository.delete_table(grind_poster_stamp, grind_poster_uid=uid)
        await self.add_stamps(uid, stamps)


class GrindErrandService(BaseService[GrindErrand, GrindErrandCreate, GrindErrandUpdate]):
    def __init__(self):
        super().__init__(GrindErrandRepository())

    async def add_members(self, uid: str, members: list[str]):
        await self.repository.table_insert(
            grind_errand_member,
            mappings=[{"grind_errand_uid": uid, "grind_user_uid": member} for member in members]
        )

    async def update_members(self, uid: str, members: list[str]) -> None:
        await self.repository.delete_table(grind_errand_member, grind_errand_uid=uid)
        await self.add_members(uid, members)

    async def update_stamps(self, uid: str, stamps: list[str]) -> None:
        await self.repository.delete_table(grind_errand_stamp, grind_errand_uid=uid)
        await self.add_stamps(uid, stamps)

    async def add_stamps(self, uid: str, stamps: list[str]):
        await self.repository.table_insert(
            grind_errand_stamp,
            mappings=[{"grind_errand_uid": uid, "grind_stamp_uid": stamp} for stamp in stamps]
        )


class GrindErrandDiscussionService(
    BaseService[GrindErrandDiscussion, GrindErrandDiscussionCreate, GrindErrandDiscussionUpdate]):
    def __init__(self):
        super().__init__(GrindErrandDiscussionRepository())


class GrindLabelService(BaseService[GrindLabel, GrindLabelCreate, GrindLabelUpdate]):
    def __init__(self):
        super().__init__(GrindLabelRepository())


class GrindMediaService(BaseService[GrindMedia, GrindMediaCreate, GrindMediaUpdate]):
    def __init__(self):
        super().__init__(GrindMediaRepository())


class GrindMilestoneService(BaseService[GrindMilestone, GrindMilestoneCreate, GrindMilestoneUpdate]):
    def __init__(self):
        super().__init__(GrindMilestoneRepository())


class GrindOccurrenceService(BaseService[GrindOccurrence, GrindOccurrenceCreate, GrindOccurrenceUpdate]):
    def __init__(self):
        super().__init__(GrindOccurrenceRepository())


class GrindStampService(BaseService[GrindStamp, GrindStampCreate, GrindStampUpdate]):
    def __init__(self):
        super().__init__(GrindStampRepository())

    async def get_errands(self, uid) -> list[GrindErrand]:
        errand_uids = await self.repository.query_table(
            grind_errand_stamp, columns=['grind_errand_uid'], stamp_uid=uid
        )
        return await GrindErrandService().get_by_uids(errand_uids)

    async def get_posters(self, uid) -> list[GrindPoster]:
        poster_uids = await self.repository.query_table(
            grind_poster_stamp, columns=['grind_poster_uid'], stamp_uid=uid
        )
        return await GrindPosterService().get_by_uids(poster_uids)
