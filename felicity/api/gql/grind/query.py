import os
from datetime import timedelta
from typing import List, Optional
from urllib.parse import quote

import sqlalchemy as sa
import strawberry
from strawberry.permission import PermissionExtension

from felicity.api.gql.grind import types
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import PageInfo
from felicity.apps.grind.enum import StampCategory
from felicity.apps.grind.services import (
    GrindSchemeService,
    GrindBoardService,
    GrindPosterService,
    GrindErrandService,
    GrindLabelService,
    GrindMediaService,
    GrindMilestoneService,
    GrindOccurrenceService, GrindStampService, GrindErrandDiscussionService,
)
from felicity.apps.guard import FAction, FObject
from felicity.apps.iol.minio import MinioClient
from felicity.apps.iol.minio.enum import MinioBucket
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class GrindQuery:
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_scheme_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindSchemeCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await GrindSchemeService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindSchemeEdge[types.GrindSchemeType]] = page.edges
        items: List[types.GrindSchemeType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindSchemeCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_scheme_by_uid(self, info, uid: str) -> Optional[types.GrindSchemeType]:
        return await GrindSchemeService().get(uid=uid)

    # Board Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_board_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            scheme_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindBoardCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if scheme_uid:
            filters["scheme_uid"] = scheme_uid

        page = await GrindBoardService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindBoardEdge[types.GrindBoardType]] = page.edges
        items: List[types.GrindBoardType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindBoardCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_board_by_uid(self, info, uid: str) -> Optional[types.GrindBoardType]:
        return await GrindBoardService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_boards_by_scheme(self, info, scheme_uid: str) -> List[types.GrindBoardType]:
        return await GrindBoardService().get_all(scheme_uid=scheme_uid)

    # Poster Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_poster_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            board_uid: str | None = None,
            category: str | None = None,
            status: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindPosterCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if board_uid:
            filters["board_uid"] = board_uid

        if category:
            filters["category"] = category

        if status:
            filters["status"] = status

        page = await GrindPosterService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindPosterEdge[types.GrindPosterType]] = page.edges
        items: List[types.GrindPosterType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindPosterCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_poster_by_uid(self, info, uid: str) -> Optional[types.GrindPosterType]:
        return await GrindPosterService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_posters_by_board(self, info, board_uid: str) -> List[types.GrindPosterType]:
        return await GrindPosterService().get_all(board_uid=board_uid)

    # Errand Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errand_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            poster_uid: str | None = None,
            category: str | None = None,
            priority: str | None = None,
            assignee_uid: str | None = None,
            reporter_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindErrandCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if poster_uid:
            filters["poster_uid"] = poster_uid

        if category:
            filters["category"] = category

        if priority:
            filters["priority"] = priority

        if assignee_uid:
            filters["assignee_uid"] = assignee_uid

        if reporter_uid:
            filters["reporter_uid"] = reporter_uid

        page = await GrindErrandService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindErrandEdge[types.GrindErrandType]] = page.edges
        items: List[types.GrindErrandType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindErrandCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errand_by_uid(self, info, uid: str) -> Optional[types.GrindErrandType]:
        return await GrindErrandService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errands_by_poster(self, info, poster_uid: str) -> List[types.GrindErrandType]:
        return await GrindErrandService().get_all(poster_uid=poster_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errands_by_assignee(self, info, assignee_uid: str) -> List[types.GrindErrandType]:
        return await GrindErrandService().get_all(assignee_uid=assignee_uid)

    # Label Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_label_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindLabelCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "category__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await GrindLabelService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindLabelEdge[types.GrindLabelType]] = page.edges
        items: List[types.GrindLabelType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindLabelCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_label_by_uid(self, info, uid: str) -> Optional[types.GrindLabelType]:
        return await GrindLabelService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_labels_by_category(self, info, category: str) -> List[types.GrindLabelType]:
        return await GrindLabelService().get_all(category=category)

    # Label Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_stamp_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindStampCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "category__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await GrindStampService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindStampEdge[types.GrindStampType]] = page.edges
        items: List[types.GrindStampType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindStampCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_stamp_by_uid(self, info, uid: str) -> Optional[types.GrindStampType]:
        return await GrindStampService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_stamp_by_category(self, info, category: StampCategory) -> List[types.GrindStampType]:
        return await GrindStampService().get_all(category=category)

    # Media Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_media_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            target: str | None = None,
            target_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindMediaCursorPage:
        filters = {}

        if target:
            filters["target"] = target

        if target_uid:
            filters["target_uid"] = target_uid

        page = await GrindMediaService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindMediaEdge[types.GrindMediaType]] = page.edges
        items: List[types.GrindMediaType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindMediaCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_media_by_uid(self, info, uid: str) -> Optional[types.GrindMediaType]:
        return await GrindMediaService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_media_by_target(self, info, target: str, target_uid: str) -> List[types.GrindMediaType]:
        return await GrindMediaService().get_all(target=target, target_uid=target_uid)

    # Milestone Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_milestone_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            errand_uid: str | None = None,
            complete: bool | None = None,
            assignee_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindMilestoneCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if errand_uid:
            filters["errand_uid"] = errand_uid

        if complete is not None:
            filters["complete"] = complete

        if assignee_uid:
            filters["assignee_uid"] = assignee_uid

        page = await GrindMilestoneService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindMilestoneEdge[types.GrindMilestoneType]] = page.edges
        items: List[types.GrindMilestoneType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindMilestoneCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_milestone_by_uid(self, info, uid: str) -> Optional[types.GrindMilestoneType]:
        return await GrindMilestoneService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_milestones_by_errand(self, info, errand_uid: str) -> List[types.GrindMilestoneType]:
        return await GrindMilestoneService().get_all(errand_uid=errand_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_milestones_by_assignee(self, info, assignee_uid: str) -> List[types.GrindMilestoneType]:
        return await GrindMilestoneService().get_all(assignee_uid=assignee_uid)

    # Occurrence Queries
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_occurrence_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            target: str | None = None,
            target_uid: str | None = None,
            actor_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.GrindOccurrenceCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if target:
            filters["target"] = target

        if target_uid:
            filters["target_uid"] = target_uid

        if actor_uid:
            filters["actor_uid"] = actor_uid

        page = await GrindOccurrenceService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.GrindOccurrenceEdge[types.GrindOccurrenceType]] = page.edges
        items: List[types.GrindOccurrenceType] = page.items
        page_info: PageInfo = page.page_info

        return types.GrindOccurrenceCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_occurrence_by_uid(self, info, uid: str) -> Optional[types.GrindOccurrenceType]:
        return await GrindOccurrenceService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_occurrences_by_target(self, info, target: str, target_uid: str) -> List[types.GrindOccurrenceType]:
        return await GrindOccurrenceService().get_all(target=target, target_uid=target_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_occurrences_by_actor(self, info, actor_uid: str) -> List[types.GrindOccurrenceType]:
        return await GrindOccurrenceService().get_all(actor_uid=actor_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errand_discussions(self, info, errand_uid: str) -> List[types.GrindErrandDiscussionType]:
        return await GrindErrandDiscussionService().get_all(
            errand_uid=errand_uid, parent_uid=None, sort_attrs=["-created_at"]
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SCHEMES)]
        )]
    )
    async def grind_errand_discussions_by_parent(self, info, parent_uid: str) -> List[types.GrindErrandDiscussionType]:
        return await GrindErrandDiscussionService().get_all(parent_uid=parent_uid, sort_attrs=["-created_at"])

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def download_grind_media_file_url(self, info, uid: str) -> types.FileUrlResponseType:
        media = await GrindMediaService().get(uid=uid)

        if not media:
            raise Exception("Media not found")

        if media.destination == "minio":
            download_url = MinioClient().client.presigned_get_object(
                bucket_name=MinioBucket.GRIND_MEDIA,
                object_name=media.path,
                expires=timedelta(minutes=5)  # valid for 1 minute since download is instant
            )
        else:
            if not os.path.exists(media.path):
                raise Exception("File not found on server")
            download_url = quote(os.path.basename(media.path))

        return types.FileUrlResponseType(
            uid=media.uid,
            filename=media.filename,
            mimetype=media.mimetype,
            download_url=download_url
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def download_grind_media_file(self, info, uid: str) -> types.FileResponseType:
        media = await GrindMediaService().get(uid=uid)

        if not media:
            raise Exception("Media not found")

        # Create response type with file data and metadata
        if media.destination == "minio":
            # Get file content from MinIO
            try:
                files = MinioClient().get_object(
                    bucket=MinioBucket.GRIND_MEDIA,
                    object_names=[media.path]
                )
                if not files:
                    raise Exception(f"Failed to retrieve {media.path}")

                file_data = files[0]
            except Exception as e:
                raise Exception(str(e))
        else:
            # Get file from local filesystem
            if not os.path.exists(media.path):
                raise Exception("File not found on server")

            try:
                with open(media.path, 'rb') as f:
                    file_data = f.read()
            except Exception as e:
                raise Exception(f"Failed to read local file: {str(e)}")

        # Return file response object with content and metadata
        return types.FileResponseType.from_binary(
            uid=media.uid,
            filename=media.filename,
            mimetype=media.mimetype,
            binary_content=file_data
        )
