import io
import logging
import os
import shutil
import uuid

import strawberry
from strawberry.permission import PermissionExtension

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.grind import inputs, responses, types
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import OperationError, DeletedItem, DeleteResponse
from felicity.apps.grind import schema
from felicity.apps.grind.enum import OccurrenceTarget
from felicity.apps.grind.services import (
    GrindSchemeService,
    GrindBoardService,
    GrindPosterService,
    GrindErrandService,
    GrindLabelService,
    GrindMediaService,
    GrindMilestoneService,
    GrindOccurrenceService,
    GrindStampService, GrindErrandDiscussionService,
)
from felicity.apps.guard import FAction, FObject
from felicity.apps.iol.minio import MinioClient
from felicity.apps.iol.minio.enum import MinioBucket
from felicity.core.config import settings
from felicity.utils.dirs import resolve_media_dirs_for, delete_file

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class GrindMutations:
    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SCHEMES)]
        )]
    )
    async def create_grind_scheme(
            self, info, payload: inputs.GrindCreateSchemeInput
    ) -> responses.GrindSchemeResponse:
        felicity_user = await auth_from_info(info)

        exists = await GrindSchemeService().get(title=payload.title)
        if exists:
            return OperationError(error="Scheme with this title already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Handle assignee field mapping to assignee_uid
        if payload.assignee:
            incoming["assignee_uid"] = payload.assignee

        # Process other fields from the input
        for k, v in payload.__dict__.items():
            if k != "assignee" and k != "members":  # Skip these as they're handled specially
                incoming[k] = v

        # Create the scheme
        obj_in = schema.GrindSchemeCreate(**incoming)
        scheme = await GrindSchemeService().create(obj_in)

        # Add members if provided
        if payload.members and len(payload.members) > 0:
            await GrindSchemeService().add_members(scheme.uid, payload.members)

        return types.GrindSchemeType(**scheme.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SCHEMES, "modify")]
        )]
    )
    async def update_grind_scheme(
            self, info, uid: str, payload: inputs.GrindUpdateSchemeInput
    ) -> responses.GrindSchemeResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        scheme = await GrindSchemeService().get(uid=uid)
        if not scheme:
            return OperationError(
                error=f"Scheme with uid {uid} not found. Cannot update object..."
            )

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Handle assignee field mapping to assignee_uid
        if payload.assignee is not None:
            update_data["assignee_uid"] = payload.assignee

        # Process other fields from the input
        for field in scheme.to_dict():
            if field in payload.__dict__ and field not in ["assignee", "members"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the scheme
        obj_in = schema.GrindSchemeUpdate(**update_data)
        scheme = await GrindSchemeService().update(scheme.uid, obj_in)

        # Update members if provided
        if payload.members is not None:
            await GrindSchemeService().update_members(scheme.uid, payload.members)

        return types.GrindSchemeType(**scheme.marshal_simple(exclude=["members", "boards"]))

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.DELETE, FObject.SCHEMES)]
        )]
    )
    async def delete_grind_scheme(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        scheme = await GrindSchemeService().get(uid=uid)
        if not scheme:
            return OperationError(error=f"Scheme with uid {uid} not found.")

        # Check if there are any boards linked to this scheme
        boards = await GrindBoardService().get_all(scheme_uid=uid)
        if boards and len(boards) > 0:
            return OperationError(
                error="Cannot delete scheme that has boards. Delete associated boards first."
            )

        await GrindSchemeService().delete(uid)
        return DeletedItem(uid=uid)

    # Board Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_board(
            self, info, payload: inputs.GrindCreateBoardInput
    ) -> responses.GrindBoardResponse:
        felicity_user = await auth_from_info(info)

        # Check if scheme exists if provided
        if payload.schemeUid:
            scheme = await GrindSchemeService().get(uid=payload.schemeUid)
            if not scheme:
                return OperationError(error=f"Scheme with uid {payload.schemeUid} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Handle scheme field mapping to scheme_uid
        if payload.schemeUid:
            incoming["scheme_uid"] = payload.schemeUid

        # Process other fields from the input
        for k, v in payload.__dict__.items():
            if k != "scheme":  # Skip this as it's handled specially
                incoming[k] = v

        # Create the board
        obj_in = schema.GrindBoardCreate(**incoming)
        board = await GrindBoardService().create(obj_in)

        return types.GrindBoardType(**board.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_board(
            self, info, uid: str, payload: inputs.GrindUpdateBoardInput
    ) -> responses.GrindBoardResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        board = await GrindBoardService().get(uid=uid)
        if not board:
            return OperationError(
                error=f"Board with uid {uid} not found. Cannot update object..."
            )

        # Check if scheme exists if provided
        if payload.schemeUid:
            scheme = await GrindSchemeService().get(uid=payload.schemeUid)
            if not scheme:
                return OperationError(error=f"Scheme with uid {payload.schemeUid} not found.")

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Handle scheme field mapping to scheme_uid
        if payload.schemeUid is not None:
            update_data["scheme_uid"] = payload.schemeUid

        # Process other fields from the input
        for field in board.to_dict():
            if field in payload.__dict__ and field != "scheme":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the board
        obj_in = schema.GrindBoardUpdate(**update_data)
        board = await GrindBoardService().update(board.uid, obj_in)

        return types.GrindBoardType(**board.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_board(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        board = await GrindBoardService().get(uid=uid)
        if not board:
            return OperationError(error=f"Board with uid {uid} not found.")

        # Check if there are any posters linked to this board
        posters = await GrindPosterService().get_all(board_uid=uid)
        if posters and len(posters) > 0:
            return OperationError(
                error="Cannot delete board that has posters. Delete associated posters first."
            )

        await GrindBoardService().delete(uid)
        return DeletedItem(uid=uid)

    # Poster Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_poster(
            self, info, payload: inputs.GrindCreatePosterInput
    ) -> responses.GrindPosterResponse:
        felicity_user = await auth_from_info(info)

        # Check if board exists if provided
        if payload.boardUid:
            board = await GrindBoardService().get(uid=payload.boardUid)
            if not board:
                return OperationError(error=f"Board with uid {payload.boardUid} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Handle field mappings
        if payload.boardUid:
            incoming["board_uid"] = payload.boardUid
        if payload.assigneeUid:
            incoming["assignee_uid"] = payload.assigneeUid

        # Process other fields from the input
        for k, v in payload.__dict__.items():
            if k not in ["board", "assignee", "members", "stamps"]:
                incoming[k] = v

        # Create the poster
        obj_in = schema.GrindPosterCreate(**incoming)
        poster = await GrindPosterService().create(obj_in)

        # Add members if provided
        if payload.members and len(payload.members) > 0:
            await GrindPosterService().add_members(poster.uid, payload.members)

        # Add stamps if provided
        if payload.stamps and len(payload.stamps) > 0:
            await GrindPosterService().add_stamps(poster.uid, payload.stamps)

        return types.GrindPosterType(**poster.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_poster(
            self, info, uid: str, payload: inputs.GrindUpdatePosterInput
    ) -> responses.GrindPosterResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        poster = await GrindPosterService().get(uid=uid)
        if not poster:
            return OperationError(
                error=f"Poster with uid {uid} not found. Cannot update object..."
            )

        # Check if board exists if provided
        if payload.boardUid:
            board = await GrindBoardService().get(uid=payload.boardUid)
            if not board:
                return OperationError(error=f"Board with uid {payload.boardUid} not found.")

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Handle field mappings
        if payload.boardUid is not None:
            update_data["board_uid"] = payload.boardUid
        if payload.assigneeUid is not None:
            update_data["assignee_uid"] = payload.assigneeUid

        # Process other fields from the input
        for field in poster.to_dict():
            if field in payload.__dict__ and field not in ["board", "assignee", "members", "stamps"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the poster
        obj_in = schema.GrindPosterUpdate(**update_data)
        poster = await GrindPosterService().update(poster.uid, obj_in)

        # Update members if provided
        if payload.members is not None:
            await GrindPosterService().update_members(poster.uid, payload.members)

        # Update stamps if provided
        if payload.stamps is not None:
            await GrindPosterService().update_stamps(poster.uid, payload.stamps)

        return types.GrindPosterType(**poster.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_poster(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        poster = await GrindPosterService().get(uid=uid)
        if not poster:
            return OperationError(error=f"Poster with uid {uid} not found.")

        # Check if there are any errands linked to this poster
        errands = await GrindErrandService().get_all(poster_uid=uid)
        if errands and len(errands) > 0:
            return OperationError(
                error="Cannot delete poster that has errands. Delete associated errands first."
            )

        await GrindPosterService().delete(uid)
        return DeletedItem(uid=uid)

    # Errand Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_errand(
            self, info, payload: inputs.GrindCreateErrandInput
    ) -> responses.GrindErrandResponse:
        felicity_user = await auth_from_info(info)

        # Check if poster exists if provided
        if payload.posterUid:
            poster = await GrindPosterService().get(uid=payload.posterUid)
            if not poster:
                return OperationError(error=f"Poster with uid {payload.posterUid} not found.")

        # Check if label exists if provided
        if payload.labelUid:
            label = await GrindLabelService().get(uid=payload.labelUid)
            if not label:
                return OperationError(error=f"Label with uid {payload.labelUid} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Handle field mappings
        if payload.posterUid:
            incoming["poster_uid"] = payload.posterUid
        if payload.labelUid:
            incoming["label_uid"] = payload.labelUid
        if payload.assigneeUid:
            incoming["assignee_uid"] = payload.assigneeUid
        if payload.reporterUid:
            incoming["reporter_uid"] = payload.reporterUid

        # Process other fields from the input
        for k, v in payload.__dict__.items():
            if k not in ["poster", "label", "assignee", "reporter", "members", "stamps", "milestones"]:
                incoming[k] = v

        # Create the errand
        obj_in = schema.GrindErrandCreate(**incoming)
        errand = await GrindErrandService().create(obj_in)

        # Add members if provided
        if payload.members and len(payload.members) > 0:
            await GrindErrandService().add_members(errand.uid, payload.members)

        # Add stamps if provided
        if payload.stamps and len(payload.stamps) > 0:
            await GrindErrandService().add_stamps(errand.uid, payload.stamps)

        # Create milestones if provided
        if payload.milestones and len(payload.milestones) > 0:
            for milestone_data in payload.milestones:
                milestone_in = schema.GrindMilestoneCreate(
                    errand_uid=errand.uid,
                    title=milestone_data,
                    created_by_uid=felicity_user.uid,
                    updated_by_uid=felicity_user.uid,
                )
                await GrindMilestoneService().create(milestone_in)

        return types.GrindErrandType(**errand.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_errand(
            self, info, uid: str, payload: inputs.GrindUpdateErrandInput
    ) -> responses.GrindErrandResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        errand = await GrindErrandService().get(uid=uid)
        if not errand:
            return OperationError(
                error=f"Errand with uid {uid} not found. Cannot update object..."
            )

        # Check if poster exists if provided
        if payload.posterUid:
            poster = await GrindPosterService().get(uid=payload.posterUid)
            if not poster:
                return OperationError(error=f"Poster with uid {payload.posterUid} not found.")

        # Check if label exists if provided
        if payload.labelUid:
            label = await GrindLabelService().get(uid=payload.labelUid)
            if not label:
                return OperationError(error=f"Label with uid {payload.labelUid} not found.")

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Handle field mappings
        if payload.posterUid is not None:
            update_data["poster_uid"] = payload.posterUid
        if payload.labelUid is not None:
            update_data["label_uid"] = payload.labelUid
        if payload.assigneeUid is not None:
            update_data["assignee_uid"] = payload.assigneeUid
        if payload.reporterUid is not None:
            update_data["reporter_uid"] = payload.reporterUid

        # Process other fields from the input
        for field in errand.to_dict():
            if field in payload.__dict__ and field not in ["poster", "label", "assignee", "reporter", "members",
                                                           "stamps", "milestones"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the errand
        obj_in = schema.GrindErrandUpdate(**update_data)
        errand = await GrindErrandService().update(errand.uid, obj_in)

        # Update members if provided
        if payload.members is not None:
            await GrindErrandService().update_members(errand.uid, payload.members)

        # Update stamps if provided
        if payload.stamps is not None:
            await GrindErrandService().update_stamps(errand.uid, payload.stamps)

        return types.GrindErrandType(**errand.marshal_simple(
            exclude=["stamps", "milestones", "members", "occurrences", "media"]
        ))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_errand(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        errand = await GrindErrandService().get(uid=uid)
        if not errand:
            return OperationError(error=f"Errand with uid {uid} not found.")

        # Delete associated milestones
        milestones = await GrindMilestoneService().get_all(errand_uid=uid)
        for milestone in milestones:
            await GrindMilestoneService().delete(milestone.uid)

        # Delete associated occurrences
        occurrences = await GrindOccurrenceService().get_all(target_uid=uid)
        for occurrence in occurrences:
            await GrindOccurrenceService().delete(occurrence.uid)

        await GrindErrandService().delete(uid)
        return DeletedItem(uid=uid)

    # Label Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_label(
            self, info, payload: inputs.GrindCreateLabelInput
    ) -> responses.GrindLabelResponse:
        felicity_user = await auth_from_info(info)

        exists = await GrindLabelService().get(title=payload.title, category=payload.category)
        if exists:
            return OperationError(
                error=f"Label with title '{payload.title}' and category '{payload.category}' already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Process fields from the input
        for k, v in payload.__dict__.items():
            incoming[k] = v

        # Create the label
        obj_in = schema.GrindLabelCreate(**incoming)
        label = await GrindLabelService().create(obj_in)

        return types.GrindLabelType(**label.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_label(
            self, info, uid: str, payload: inputs.GrindUpdateLabelInput
    ) -> responses.GrindLabelResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        label = await GrindLabelService().get(uid=uid)
        if not label:
            return OperationError(
                error=f"Label with uid {uid} not found. Cannot update object..."
            )

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Process other fields from the input
        for field in label.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the label
        obj_in = schema.GrindLabelUpdate(**update_data)
        label = await GrindLabelService().update(label.uid, obj_in)

        return types.GrindLabelType(**label.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_label(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        label = await GrindLabelService().get(uid=uid)
        if not label:
            return OperationError(error=f"Label with uid {uid} not found.")

        # Check if there are any errands using this label
        errands = await GrindErrandService().get_all(label_uid=uid)
        if errands and len(errands) > 0:
            return OperationError(
                error="Cannot delete label that is in use by errands. Update errands first."
            )

        await GrindLabelService().delete(uid)
        return DeletedItem(uid=uid)

    # Media Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_media(
            self, info, payload: inputs.GrindCreateMediaInput
    ) -> responses.GrindMediaResponse:
        felicity_user = await auth_from_info(info)

        file = payload.file
        filename = f"{uuid.uuid4()}_{file.filename}"
        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "filename": filename,
            "mimetype": file.content_type,
            "original_name": file.filename,
            "encoding": file.headers.get("Content-Encoding", ""),
            "target": payload.target.value,
        }

        # Process fields from the input
        for k, v in payload.__dict__.items():
            if k not in ["file", "target"]:  # Skip file and already handled fields
                incoming[k] = v

        await file.seek(0)
        if not settings.OBJECT_STORAGE:
            destination = resolve_media_dirs_for(payload.target.value)
            path = os.path.join(destination, filename)

            with open(path, 'wb') as dest_file:
                shutil.copyfileobj(io.BytesIO(await file.read()), dest_file)  # type: ignore

            incoming: dict = {
                **incoming,
                "path": path,
                "destination": destination,
                "size": str(os.path.getsize(path)),
            }
        else:
            incoming: dict = {
                **incoming,
                "destination": "minio",
                "size": file.size,
            }

        # Create the media
        obj_in = schema.GrindMediaCreate(**incoming)
        media = await GrindMediaService().create(obj_in)

        # save file to minio
        if settings.OBJECT_STORAGE:
            # Use the media's uid in the object name for easier retrieval and deletion
            object_name = f"{media.uid}/{media.original_name}"

            # Update the media record with the MinIO object path
            await GrindMediaService().update(
                uid=media.uid,
                update={"path": object_name}
            )

            # Store file in MinIO
            MinioClient().put_object(
                bucket=MinioBucket.GRIND_MEDIA,
                object_name=object_name,
                data=file,
                content_type=media.mimetype,  # Add content type
                metadata={
                    "mimetype": media.mimetype,
                    "original_name": media.original_name,
                    "media_uid": media.uid,
                    "target": payload.target.value,
                    "target_uid": payload.target_uid,
                },
            )

            # Refresh the media object after update
            media = await GrindMediaService().get(uid=media.uid)

        return types.GrindMediaType(**media.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_media(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        media = await GrindMediaService().get(uid=uid)
        if not media:
            return OperationError(error=f"Media with uid {uid} not found.")

        try:
            # Determine storage type and delete accordingly
            if getattr(media, "destination", "local") == "minio" or settings.OBJECT_STORAGE:
                # Delete from MinIO
                object_name = media.path
                bucket = MinioBucket.GRIND_MEDIA

                try:
                    MinioClient().remove_object(bucket=bucket, object_name=object_name)
                except Exception as e:
                    logging.error(f"Failed to delete object from MinIO: {str(e)}")
                    # Continue with deletion even if MinIO fails
            else:
                # Delete from local filesystem
                delete_file(media.path)
        except OSError as e:
            return OperationError(error=f"Failed to delete associated file to media {uid}.")

        await GrindMediaService().delete(uid)
        return DeletedItem(uid=uid)

    # Milestone Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_milestone(
            self, info, payload: inputs.GrindCreateMilestoneInput
    ) -> responses.GrindMilestoneResponse:
        felicity_user = await auth_from_info(info)

        # Check if errand exists
        errand = await GrindErrandService().get(uid=payload.errandUid)
        if not errand:
            return OperationError(error=f"Errand with uid {payload.errandUid} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "errand_uid": payload.errandUid,
        }

        # Handle assignee field mapping to assignee_uid
        if payload.assigneeUid:
            incoming["assignee_uid"] = payload.assigneeUid

        # Process other fields from the input
        for k, v in payload.__dict__.items():
            if k not in ["errand", "assignee"]:  # Skip these as they're handled specially
                incoming[k] = v

        # Create the milestone
        obj_in = schema.GrindMilestoneCreate(**incoming)
        milestone = await GrindMilestoneService().create(obj_in)

        # Create an occurrence for this milestone creation
        occurrence_in = schema.GrindOccurrenceCreate(
            target=OccurrenceTarget.MILESTONE,
            target_uid=milestone.uid,
            actor_uid=felicity_user.uid,
            description=f"Milestone '{milestone.title}' created",
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await GrindOccurrenceService().create(occurrence_in)

        return types.GrindMilestoneType(**milestone.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_milestone(
            self, info, uid: str, payload: inputs.GrindUpdateMilestoneInput
    ) -> responses.GrindMilestoneResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        milestone = await GrindMilestoneService().get(uid=uid)
        if not milestone:
            return OperationError(
                error=f"Milestone with uid {uid} not found. Cannot update object..."
            )

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Handle special fields
        if payload.assigneeUid is not None:
            update_data["assignee_uid"] = payload.assigneeUid

        # Process other fields from the input
        for field in milestone.to_dict():
            if field in payload.__dict__ and field not in ["errand", "assignee"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Check if complete status is being changed
        complete_changed = False
        if "complete" in update_data and update_data["complete"] != milestone.complete:
            complete_changed = True

        # Update the milestone
        obj_in = schema.GrindMilestoneUpdate(**update_data)
        milestone = await GrindMilestoneService().update(milestone.uid, obj_in)

        # If complete status changed, create an occurrence
        if complete_changed:
            status = "completed" if milestone.complete else "reopened"
            occurrence_in = schema.GrindOccurrenceCreate(
                target=OccurrenceTarget.MILESTONE,
                target_uid=milestone.uid,
                actor_uid=felicity_user.uid,
                description=f"Milestone '{milestone.title}' {status}",
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            await GrindOccurrenceService().create(occurrence_in)

        return types.GrindMilestoneType(**milestone.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_milestone(self, info, uid: str) -> DeleteResponse:
        felicity_user = await auth_from_info(info)

        milestone = await GrindMilestoneService().get(uid=uid)
        if not milestone:
            return OperationError(error=f"Milestone with uid {uid} not found.")

        # Delete associated occurrences
        occurrences = await GrindOccurrenceService().get_all(target="MILESTONE", target_uid=uid)
        for occurrence in occurrences:
            await GrindOccurrenceService().delete(occurrence.uid)

        # Create an occurrence for the deletion on the parent errand
        if milestone.errand_uid:
            occurrence_in = schema.GrindOccurrenceCreate(
                target=OccurrenceTarget.ERRAND,
                target_uid=milestone.errand_uid,
                actor_uid=felicity_user.uid,
                description=f"Milestone '{milestone.title}' deleted",
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            await GrindOccurrenceService().create(occurrence_in)

        await GrindMilestoneService().delete(uid)
        return DeletedItem(uid=uid)

    # Stamp Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_stamp(
            self, info, payload: inputs.GrindCreateStampInput
    ) -> responses.GrindStampResponse:
        felicity_user = await auth_from_info(info)

        exists = await GrindStampService().get(title=payload.title, category=payload.category)
        if exists:
            return OperationError(
                error=f"Stamp with title '{payload.title}' and category '{payload.category}' already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Process fields from the input
        for k, v in payload.__dict__.items():
            incoming[k] = v

        # Create the stamp
        obj_in = schema.GrindStampCreate(**incoming)
        stamp = await GrindStampService().create(obj_in)

        return types.GrindStampType(**stamp.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_stamp(
            self, info, uid: str, payload: inputs.GrindUpdateStampInput
    ) -> responses.GrindStampResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        stamp = await GrindStampService().get(uid=uid)
        if not stamp:
            return OperationError(
                error=f"Stamp with uid {uid} not found. Cannot update object..."
            )

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Process other fields from the input
        for field in stamp.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the stamp
        obj_in = schema.GrindStampUpdate(**update_data)
        stamp = await GrindStampService().update(stamp.uid, obj_in)

        return types.GrindStampType(**stamp.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_grind_stamp(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        stamp = await GrindStampService().get(uid=uid)
        if not stamp:
            return OperationError(error=f"Stamp with uid {uid} not found.")

        # Check if stamp is used by any posters or errands
        used_by_posters = await GrindStampService().get_posters(uid)
        used_by_errands = await GrindStampService().get_errands(uid)

        if (used_by_posters and len(used_by_posters) > 0) or (used_by_errands and len(used_by_errands) > 0):
            return OperationError(
                error="Cannot delete stamp that is in use. Remove from posters and errands first."
            )

        await GrindStampService().delete(uid)
        return DeletedItem(uid=uid)

    # Stamp Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_grind_errand_discussion(
            self, info, payload: inputs.GrindCreateErrandDiscussionInput
    ) -> responses.GrindErrandDiscussionResponse:
        felicity_user = await auth_from_info(info)

        exists = await GrindErrandDiscussionService().get(comment=payload.comment, errand_uid=payload.errand_uid)
        if exists:
            return OperationError(
                error=f"Comment '{payload.comment}' already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Process fields from the input
        for k, v in payload.__dict__.items():
            incoming[k] = v

        # Create the stamp
        obj_in = schema.GrindErrandDiscussionCreate(**incoming)
        comment = await GrindErrandDiscussionService().create(obj_in)

        return types.GrindErrandDiscussionType(**comment.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_grind_errand_discussion(
            self, info, uid: str, payload: inputs.GrindUpdateErrandDiscussionInput
    ) -> responses.GrindErrandDiscussionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        comment = await GrindErrandDiscussionService().get(uid=uid)
        if not comment:
            return OperationError(
                error=f"Stamp with uid {uid} not found. Cannot update object..."
            )

        # Prepare update data
        update_data = {"updated_by_uid": felicity_user.uid}

        # Process other fields from the input
        for field in comment.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Update the stamp
        obj_in = schema.GrindErrandDiscussionUpdate(**update_data)
        comment = await GrindErrandDiscussionService().update(comment.uid, obj_in)
        return types.GrindErrandDiscussionType(**comment.marshal_simple())
