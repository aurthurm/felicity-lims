import logging

import strawberry

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.document import types, inputs, responses
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.document import schemas
from felicity.apps.document.enum import DocumentState
from felicity.apps.document.services import (
    DocumentCategoryService,
    DocumentTagService,
    DocumentService,
    DocumentStatusService,
    DocumentFolderService,
    DocumentVersionService,
    DocumentReviewCycleService,
    DocumentReviewStepService,
    DocumentTemplateService,
    DocumentSubscriptionService,
    DocumentAuditService,
    DocumentAIModelService,
    DocumentAIAuthoringSessionService,
    DocumentComplianceStandardService,
    DocumentAIComplianceCheckService,
    DocumentComplianceIssueService,
    DocumentAIReviewFeedbackService,
    DocumentAnalyticsService,
)
from felicity.apps.setup.services import DepartmentService
from felicity.core.dtz import timenow_dt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Union Response Types

@strawberry.type
class DocumentMutations:
    # Document Category Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_category(
            self, info, payload: inputs.DocumentCategoryInputType
    ) -> responses.DocumentCategoryResponse:
        felicity_user = await auth_from_info(info)

        exists = await DocumentCategoryService().get(name=payload.name)
        if exists:
            return OperationError(error="Document category with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DocumentCategoryCreate(**incoming)
        category = await DocumentCategoryService().create(obj_in)
        return types.DocumentCategoryType(**category.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_category(
            self, info, uid: str, payload: inputs.DocumentCategoryUpdateInputType
    ) -> responses.DocumentCategoryResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        category = await DocumentCategoryService().get(uid=uid)
        if not category:
            return OperationError(
                error=f"Document category with uid {uid} not found. Cannot update object..."
            )

        update_data = {"updated_by_uid": felicity_user.uid}

        for field in category.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentCategoryUpdate(**update_data)
        category = await DocumentCategoryService().update(category.uid, obj_in)
        return types.DocumentCategoryType(**category.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_category(self, info, uid: str) -> responses.DocumentCategoryResponse:
        category = await DocumentCategoryService().get(uid=uid)
        if not category:
            return OperationError(error=f"Document category with uid {uid} not found.")

        # Check if there are any documents using this category
        documents = await DocumentService().get_all(category_uid=uid)
        if documents and len(documents) > 0:
            return OperationError(
                error="Cannot delete category that is in use by documents. Update documents first."
            )

        await DocumentCategoryService().delete(uid)
        return types.DocumentCategoryType(**category.marshal_simple())

    # Document Tag Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_tag(
            self, info, payload: inputs.DocumentTagInputType
    ) -> responses.DocumentTagResponse:
        felicity_user = await auth_from_info(info)

        exists = await DocumentTagService().get(name=payload.name)
        if exists:
            return OperationError(error="Document tag with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DocumentTagCreate(**incoming)
        tag = await DocumentTagService().create(obj_in)
        return types.DocumentTagType(**tag.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_tag(
            self, info, uid: str, payload: inputs.DocumentTagUpdateInputType
    ) -> responses.DocumentTagResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        tag = await DocumentTagService().get(uid=uid)
        if not tag:
            return OperationError(
                error=f"Document tag with uid {uid} not found. Cannot update object..."
            )

        update_data = {"updated_by_uid": felicity_user.uid}

        for field in tag.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentTagUpdate(**update_data)
        tag = await DocumentTagService().update(tag.uid, obj_in)
        return types.DocumentTagType(**tag.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_tag(self, info, uid: str) -> responses.DocumentTagResponse:
        tag = await DocumentTagService().get(uid=uid)
        if not tag:
            return OperationError(error=f"Document tag with uid {uid} not found.")

        # For many-to-many relationship, we'll assume you have a service method to check this
        # If the tag is in use, you might want to return an error
        # For now, we'll assume you can delete tags even if they're in use

        await DocumentTagService().delete(uid)
        return types.DocumentTagType(**tag.marshal_simple())

    # Document Folder Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_folder(
            self, info, payload: inputs.DocumentFolderInputType
    ) -> responses.DocumentFolderResponse:
        felicity_user = await auth_from_info(info)

        # Check if parent folder exists if provided
        if payload.parent:
            parent_folder = await DocumentFolderService().get(uid=payload.parent)
            if not parent_folder:
                return OperationError(error=f"Parent folder with uid {payload.parent} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Map parent to parent_uid
        if payload.parent:
            incoming["parent_uid"] = payload.parent

        for k, v in payload.__dict__.items():
            if k != "parent":  # Skip parent as we've handled it
                incoming[k] = v

        obj_in = schemas.DocumentFolderCreate(**incoming)
        folder = await DocumentFolderService().create(obj_in)
        return types.DocumentFolderType(**folder.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_folder(
            self, info, uid: str, payload: inputs.DocumentFolderUpdateInputType
    ) -> responses.DocumentFolderResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        folder = await DocumentFolderService().get(uid=uid)
        if not folder:
            return OperationError(
                error=f"Document folder with uid {uid} not found. Cannot update object..."
            )

        # Check if parent folder exists if provided
        if payload.parent:
            parent_folder = await DocumentFolderService().get(uid=payload.parent)
            if not parent_folder:
                return OperationError(error=f"Parent folder with uid {payload.parent} not found.")
            # Prevent creating circular references
            if payload.parent == uid:
                return OperationError(error="Folder cannot be its own parent.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map parent to parent_uid
        if payload.parent is not None:
            update_data["parent_uid"] = payload.parent

        for field in folder.to_dict():
            if field in payload.__dict__ and field != "parent":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentFolderUpdate(**update_data)
        folder = await DocumentFolderService().update(folder.uid, obj_in)
        return types.DocumentFolderType(**folder.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_folder(self, info, uid: str) -> responses.DocumentFolderResponse:
        folder = await DocumentFolderService().get(uid=uid)
        if not folder:
            return OperationError(error=f"Document folder with uid {uid} not found.")

        # Check if there are any documents in this folder
        documents = await DocumentService().get_all(folder_uid=uid)
        if documents and len(documents) > 0:
            return OperationError(
                error="Cannot delete folder that contains documents. Move or delete documents first."
            )

        # Check if there are any subfolders
        subfolders = await DocumentFolderService().get_all(parent_uid=uid)
        if subfolders and len(subfolders) > 0:
            return OperationError(
                error="Cannot delete folder that contains subfolders. Move or delete subfolders first."
            )

        await DocumentFolderService().delete(uid)
        return types.DocumentFolderType(**folder.marshal_simple())

    # Document Template Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_template(
            self, info, payload: inputs.DocumentTemplateInputType
    ) -> responses.DocumentTemplateResponse:
        felicity_user = await auth_from_info(info)

        # Check if category exists if provided
        if payload.category:
            category = await DocumentCategoryService().get(uid=payload.category)
            if not category:
                return OperationError(error=f"Category with uid {payload.category} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Map category to category_uid
        if payload.category:
            incoming["category_uid"] = payload.category

        for k, v in payload.__dict__.items():
            if k != "category":  # Skip category as we've handled it
                incoming[k] = v

        obj_in = schemas.DocumentTemplateCreate(**incoming)
        template = await DocumentTemplateService().create(obj_in)
        return types.DocumentTemplateType(**template.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_template(
            self, info, uid: str, payload: inputs.DocumentTemplateUpdateInputType
    ) -> responses.DocumentTemplateResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        template = await DocumentTemplateService().get(uid=uid)
        if not template:
            return OperationError(
                error=f"Document template with uid {uid} not found. Cannot update object..."
            )

        # Check if category exists if provided
        if payload.category:
            category = await DocumentCategoryService().get(uid=payload.category)
            if not category:
                return OperationError(error=f"Category with uid {payload.category} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map category to category_uid
        if payload.category is not None:
            update_data["category_uid"] = payload.category

        for field in template.to_dict():
            if field in payload.__dict__ and field != "category":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentTemplateUpdate(**update_data)
        template = await DocumentTemplateService().update(template.uid, obj_in)
        return types.DocumentTemplateType(**template.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_template(self, info, uid: str) -> responses.DocumentTemplateResponse:
        template = await DocumentTemplateService().get(uid=uid)
        if not template:
            return OperationError(error=f"Document template with uid {uid} not found.")

        # Check if there are documents using this template
        documents = await DocumentService().get_all(template_uid=uid)
        if documents and len(documents) > 0:
            return OperationError(
                error="Cannot delete template that is in use by documents. Update documents first."
            )

        await DocumentTemplateService().delete(uid)
        return types.DocumentTemplateType(**template.marshal_simple())

    # Document Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document(
            self, info, payload: inputs.DocumentInputType
    ) -> responses.DocumentResponse:
        felicity_user = await auth_from_info(info)

        # Check for duplicate document_id
        exists = await DocumentService().get(document_id=payload.document_id)
        if exists:
            return OperationError(error=f"Document with ID {payload.document_id} already exists")

        # Validate foreign keys
        if payload.folder:
            folder = await DocumentFolderService().get(uid=payload.folder)
            if not folder:
                return OperationError(error=f"Folder with uid {payload.folder} not found.")

        if payload.category:
            category = await DocumentCategoryService().get(uid=payload.category)
            if not category:
                return OperationError(error=f"Category with uid {payload.category} not found.")

        if payload.department:
            # Assuming you have a DepartmentService
            department = await DepartmentService().get(uid=payload.department)
            if not department:
                return OperationError(error=f"Department with uid {payload.department} not found.")

        if payload.template:
            template = await DocumentTemplateService().get(uid=payload.template)
            if not template:
                return OperationError(error=f"Template with uid {payload.template} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # Map fields to their corresponding database fields
        if payload.folder:
            incoming["folder_uid"] = payload.folder
        if payload.department:
            incoming["department_uid"] = payload.department
        if payload.category:
            incoming["category_uid"] = payload.category
        if payload.template:
            incoming["template_uid"] = payload.template

        for k, v in payload.__dict__.items():
            if k not in ["folder", "department", "category", "template", "tags", "authors", "readers",
                         "initial_content",
                         "initial_version"]:
                incoming[k] = v

        obj_in = schemas.DocumentCreate(**incoming)
        document = await DocumentService().create(obj_in)

        # Add tags if provided
        if payload.tags and len(payload.tags) > 0:
            for tag_uid in payload.tags:
                tag = await DocumentTagService().get(uid=tag_uid)
                if tag:
                    # Assuming a method to add a tag to a document
                    await DocumentService().add_tag(document.uid, tag_uid)

        # Add authors if provided
        if payload.authors and len(payload.authors) > 0:
            for author_uid in payload.authors:
                # Assuming a method to add an author to a document
                await DocumentService().add_author(document.uid, author_uid)

        # Add readers if provided
        if payload.readers and len(payload.readers) > 0:
            for reader_uid in payload.readers:
                # Assuming a method to add a reader to a document
                await DocumentService().add_reader(document.uid, reader_uid)

        # Create initial version if content provided
        if payload.initial_content:
            version_in = schemas.DocumentVersionCreate(
                document_uid=document.uid,
                version_number=payload.initial_version or "1.0",
                content=payload.initial_content,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            await DocumentVersionService().create(version_in)

        # Create initial draft status
        status_in = schemas.DocumentStatusCreate(
            document_uid=document.uid,
            status=DocumentState.DRAFT,
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentStatusService().create(status_in)

        # Create audit record for document creation
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="created",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentType(**document.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document(
            self, info, uid: str, payload: inputs.DocumentUpdateInputType
    ) -> responses.DocumentResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        document = await DocumentService().get(uid=uid)
        if not document:
            return OperationError(
                error=f"Document with uid {uid} not found. Cannot update object..."
            )

        # Check document_id uniqueness if changing
        if payload.document_id and payload.document_id != document.document_id:
            exists = await DocumentService().get(document_id=payload.document_id)
            if exists:
                return OperationError(error=f"Document with ID {payload.document_id} already exists")

        # Validate foreign keys
        if payload.folder:
            folder = await DocumentFolderService().get(uid=payload.folder)
            if not folder:
                return OperationError(error=f"Folder with uid {payload.folder} not found.")

        if payload.category:
            category = await DocumentCategoryService().get(uid=payload.category)
            if not category:
                return OperationError(error=f"Category with uid {payload.category} not found.")

        if payload.department:
            # Assuming you have a DepartmentService
            department = await DepartmentService().get(uid=payload.department)
            if not department:
                return OperationError(error=f"Department with uid {payload.department} not found.")

        if payload.template:
            template = await DocumentTemplateService().get(uid=payload.template)
            if not template:
                return OperationError(error=f"Template with uid {payload.template} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map fields to their corresponding database fields
        if payload.folder is not None:
            update_data["folder_uid"] = payload.folder
        if payload.department is not None:
            update_data["department_uid"] = payload.department
        if payload.category is not None:
            update_data["category_uid"] = payload.category
        if payload.template is not None:
            update_data["template_uid"] = payload.template

        for field in document.to_dict():
            if field in payload.__dict__ and field not in ["folder", "department", "category", "template", "tags",
                                                           "authors", "readers"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentUpdate(**update_data)
        document = await DocumentService().update(document.uid, obj_in)

        # Update tags if provided
        if payload.tags is not None:
            # Clear existing tags and add new ones
            await DocumentService().clear_tags(document.uid)
            for tag_uid in payload.tags:
                tag = await DocumentTagService().get(uid=tag_uid)
                if tag:
                    await DocumentService().add_tag(document.uid, tag_uid)

        # Update authors if provided
        if payload.authors is not None:
            # Clear existing authors and add new ones
            await DocumentService().clear_authors(document.uid)
            for author_uid in payload.authors:
                await DocumentService().add_author(document.uid, author_uid)

        # Update readers if provided
        if payload.readers is not None:
            # Clear existing readers and add new ones
            await DocumentService().clear_readers(document.uid)
            for reader_uid in payload.readers:
                await DocumentService().add_reader(document.uid, reader_uid)

        # Create audit record for document update
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="updated",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentType(**document.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document(self, info, uid: str) -> responses.DocumentResponse:
        felicity_user = await auth_from_info(info)

        document = await DocumentService().get(uid=uid)
        if not document:
            return OperationError(error=f"Document with uid {uid} not found.")

        # Delete related records
        # Versions
        versions = await DocumentVersionService().get_all(document_uid=uid)
        for version in versions:
            await DocumentVersionService().delete(version.uid)

        # Statuses
        statuses = await DocumentStatusService().get_all(document_uid=uid)
        for status in statuses:
            await DocumentStatusService().delete(status.uid)

        # Review cycles and steps
        review_cycles = await DocumentReviewCycleService().get_all(document_uid=uid)
        for cycle in review_cycles:
            steps = await DocumentReviewStepService().get_all(review_cycle_uid=cycle.uid)
            for step in steps:
                await DocumentReviewStepService().delete(step.uid)
            await DocumentReviewCycleService().delete(cycle.uid)

        # Subscriptions
        subscriptions = await DocumentSubscriptionService().get_all(document_uid=uid)
        for subscription in subscriptions:
            await DocumentSubscriptionService().delete(subscription.uid)

        # Audits
        audits = await DocumentAuditService().get_all(document_uid=uid)
        for audit in audits:
            await DocumentAuditService().delete(audit.uid)

        # Clear relationships
        await DocumentService().clear_tags(document.uid)
        await DocumentService().clear_authors(document.uid)
        await DocumentService().clear_readers(document.uid)
        # Clear document relations (both directions)
        await DocumentService().clear_related_documents(document.uid)

        # Now delete the document itself
        await DocumentService().delete(uid)
        return types.DocumentType(**document.marshal_simple())

    # Document Version Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_version(
            self, info, payload: inputs.DocumentVersionInputType
    ) -> responses.DocumentVersionResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
        }

        for k, v in payload.__dict__.items():
            if k != "document":  # Skip document as we've handled it
                incoming[k] = v

        obj_in = schemas.DocumentVersionCreate(**incoming)
        version = await DocumentVersionService().create(obj_in)

        # Create audit record for version creation
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="version_created",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentVersionType(**version.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_version(
            self, info, uid: str, payload: inputs.DocumentVersionUpdateInputType
    ) -> responses.DocumentVersionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        version = await DocumentVersionService().get(uid=uid)
        if not version:
            return OperationError(
                error=f"Document version with uid {uid} not found. Cannot update object..."
            )

        # Check if document exists if changing
        if payload.document and payload.document != version.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        for field in version.to_dict():
            if field in payload.__dict__ and field != "document":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentVersionUpdate(**update_data)
        version = await DocumentVersionService().update(version.uid, obj_in)

        # Create audit record for version update
        audit_in = schemas.DocumentAuditCreate(
            document_uid=version.document_uid,
            action="version_updated",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentVersionType(**version.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_version(self, info, uid: str) -> responses.DocumentVersionResponse:
        felicity_user = await auth_from_info(info)

        version = await DocumentVersionService().get(uid=uid)
        if not version:
            return OperationError(error=f"Document version with uid {uid} not found.")

        # Check if this is the only version
        versions = await DocumentVersionService().get_all(document_uid=version.document_uid)
        if len(versions) <= 1:
            return OperationError(error="Cannot delete the only version of a document.")

        # Create audit record for version deletion
        audit_in = schemas.DocumentAuditCreate(
            document_uid=version.document_uid,
            action="version_deleted",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        await DocumentVersionService().delete(uid)
        return types.DocumentVersionType(**version.marshal_simple())

    # Document Status Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_status(
            self, info, payload: inputs.DocumentStatusInputType
    ) -> responses.DocumentStatusResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "user_uid": felicity_user.uid,
            "date": payload.date or timenow_dt(),
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "date"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentStatusCreate(**incoming)
        status = await DocumentStatusService().create(obj_in)

        # Create audit record for status change
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action=f"status_changed_to_{payload.status}",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentStatusType(**status.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_status(
            self, info, uid: str, payload: inputs.DocumentStatusUpdateInputType
    ) -> responses.DocumentStatusResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        status = await DocumentStatusService().get(uid=uid)
        if not status:
            return OperationError(
                error=f"Document status with uid {uid} not found. Cannot update object..."
            )

        # Check if document exists if changing
        if payload.document and payload.document != status.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        for field in status.to_dict():
            if field in payload.__dict__ and field != "document":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentStatusUpdate(**update_data)
        status = await DocumentStatusService().update(status.uid, obj_in)

        return types.DocumentStatusType(**status.marshal_simple())

    # Document Review Cycle Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_review_cycle(
            self, info, payload: inputs.DocumentReviewCycleInputType
    ) -> responses.DocumentReviewCycleResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "initiated_by_uid": felicity_user.uid,
            "start_date": payload.start_date or timenow_dt(),
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "start_date", "reviewers"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentReviewCycleCreate(**incoming)
        review_cycle = await DocumentReviewCycleService().create(obj_in)

        # Create review steps for each reviewer
        if payload.reviewers and len(payload.reviewers) > 0:
            for i, reviewer_uid in enumerate(payload.reviewers):
                step_in = schemas.DocumentReviewStepCreate(
                    review_cycle_uid=review_cycle.uid,
                    reviewer_uid=reviewer_uid,
                    sequence=i + 1,
                    status="pending",
                    created_by_uid=felicity_user.uid,
                    updated_by_uid=felicity_user.uid,
                )
                await DocumentReviewStepService().create(step_in)

        # Create audit record for review cycle creation
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="review_cycle_started",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentReviewCycleType(**review_cycle.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_review_cycle(
            self, info, uid: str, payload: inputs.DocumentReviewCycleUpdateInputType
    ) -> responses.DocumentReviewCycleResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        review_cycle = await DocumentReviewCycleService().get(uid=uid)
        if not review_cycle:
            return OperationError(
                error=f"Document review cycle with uid {uid} not found. Cannot update object..."
            )

        # Check if document exists if changing
        if payload.document and payload.document != review_cycle.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        for field in review_cycle.to_dict():
            if field in payload.__dict__ and field not in ["document", "reviewers"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        # Check if status is being updated to completed
        status_changed_to_completed = False
        if payload.status and payload.status == "completed" and review_cycle.status != "completed":
            status_changed_to_completed = True
            update_data["end_date"] = timenow_dt()

        obj_in = schemas.DocumentReviewCycleUpdate(**update_data)
        review_cycle = await DocumentReviewCycleService().update(review_cycle.uid, obj_in)

        # Update reviewers if provided
        if payload.reviewers is not None:
            # Delete existing steps
            steps = await DocumentReviewStepService().get_all(review_cycle_uid=review_cycle.uid)
            for step in steps:
                await DocumentReviewStepService().delete(step.uid)

            # Create new steps
            for i, reviewer_uid in enumerate(payload.reviewers):
                step_in = schemas.DocumentReviewStepCreate(
                    review_cycle_uid=review_cycle.uid,
                    reviewer_uid=reviewer_uid,
                    sequence=i + 1,
                    status="pending",
                    created_by_uid=felicity_user.uid,
                    updated_by_uid=felicity_user.uid,
                )
                await DocumentReviewStepService().create(step_in)

        # Create audit record if status changed to completed
        if status_changed_to_completed:
            audit_in = schemas.DocumentAuditCreate(
                document_uid=review_cycle.document_uid,
                action="review_cycle_completed",
                date=timenow_dt(),
                user_uid=felicity_user.uid,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            await DocumentAuditService().create(audit_in)

        return types.DocumentReviewCycleType(**review_cycle.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_review_cycle(self, info, uid: str) -> responses.DocumentReviewCycleResponse:
        felicity_user = await auth_from_info(info)

        review_cycle = await DocumentReviewCycleService().get(uid=uid)
        if not review_cycle:
            return OperationError(error=f"Document review cycle with uid {uid} not found.")

        # Delete associated review steps
        steps = await DocumentReviewStepService().get_all(review_cycle_uid=uid)
        for step in steps:
            await DocumentReviewStepService().delete(step.uid)

        # Create audit record for review cycle deletion
        audit_in = schemas.DocumentAuditCreate(
            document_uid=review_cycle.document_uid,
            action="review_cycle_deleted",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        await DocumentReviewCycleService().delete(uid)
        return types.DocumentReviewCycleType(**review_cycle.marshal_simple())

    # Document Review Step Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_review_step(
            self, info, uid: str, payload: inputs.DocumentReviewStepUpdateInputType
    ) -> responses.DocumentReviewStepResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        step = await DocumentReviewStepService().get(uid=uid)
        if not step:
            return OperationError(
                error=f"Document review step with uid {uid} not found. Cannot update object..."
            )

        # Check if review cycle exists if changing
        if payload.review_cycle and payload.review_cycle != step.review_cycle_uid:
            cycle = await DocumentReviewCycleService().get(uid=payload.review_cycle)
            if not cycle:
                return OperationError(error=f"Review cycle with uid {payload.review_cycle} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Check if status is being updated
        status_changed = False
        old_status = step.status

        # Map review_cycle to review_cycle_uid
        if payload.review_cycle is not None:
            update_data["review_cycle_uid"] = payload.review_cycle

        # Map reviewer to reviewer_uid
        if payload.reviewer is not None:
            update_data["reviewer_uid"] = payload.reviewer

        for field in step.to_dict():
            if field in payload.__dict__ and field not in ["review_cycle", "reviewer"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]
                    if field == "status" and payload.__dict__[field] != old_status:
                        status_changed = True

        # Set action date if status is changing
        if status_changed and (payload.status == "approved" or payload.status == "rejected"):
            update_data["action_date"] = timenow_dt()

        obj_in = schemas.DocumentReviewStepUpdate(**update_data)
        step = await DocumentReviewStepService().update(step.uid, obj_in)

        # Get the document UID for audit record
        review_cycle = await DocumentReviewCycleService().get(uid=step.review_cycle_uid)

        # Create audit record for step status change
        if status_changed:
            audit_in = schemas.DocumentAuditCreate(
                document_uid=review_cycle.document_uid,
                action=f"review_step_{payload.status}",
                date=timenow_dt(),
                user_uid=felicity_user.uid,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            await DocumentAuditService().create(audit_in)

            # Check if all steps are complete, update the review cycle if needed
            all_steps = await DocumentReviewStepService().get_all(review_cycle_uid=step.review_cycle_uid)
            all_complete = all(s.status in ["approved", "rejected"] for s in all_steps)

            if all_complete and review_cycle.status != "completed":
                cycle_update = schemas.DocumentReviewCycleUpdate(
                    status="completed",
                    end_date=timenow_dt(),
                    updated_by_uid=felicity_user.uid
                )
                await DocumentReviewCycleService().update(review_cycle.uid, cycle_update)

        return types.DocumentReviewStepType(**step.marshal_simple())

    # Document Subscription Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_subscription(
            self, info, payload: inputs.DocumentSubscriptionInputType
    ) -> responses.DocumentSubscriptionResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        # Check if user exists
        from felicity.apps.user.services import UserService
        user = await UserService().get(uid=payload.user)
        if not user:
            return OperationError(error=f"User with uid {payload.user} not found.")

        # Check if subscription already exists
        exists = await DocumentSubscriptionService().get(document_uid=payload.document, user_uid=payload.user)
        if exists:
            return OperationError(error="Subscription already exists for this user and document.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "user_uid": payload.user,
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "user"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentSubscriptionCreate(**incoming)
        subscription = await DocumentSubscriptionService().create(obj_in)

        return types.DocumentSubscriptionType(**subscription.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_subscription(
            self, info, uid: str, payload: inputs.DocumentSubscriptionUpdateInputType
    ) -> responses.DocumentSubscriptionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        subscription = await DocumentSubscriptionService().get(uid=uid)
        if not subscription:
            return OperationError(
                error=f"Document subscription with uid {uid} not found. Cannot update object..."
            )

        # Validate foreign keys if changing
        if payload.document and payload.document != subscription.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        if payload.user and payload.user != subscription.user_uid:
            from felicity.apps.user.services import UserService
            user = await UserService().get(uid=payload.user)
            if not user:
                return OperationError(error=f"User with uid {payload.user} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        # Map user to user_uid
        if payload.user is not None:
            update_data["user_uid"] = payload.user

        for field in subscription.to_dict():
            if field in payload.__dict__ and field not in ["document", "user"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentSubscriptionUpdate(**update_data)
        subscription = await DocumentSubscriptionService().update(subscription.uid, obj_in)

        return types.DocumentSubscriptionType(**subscription.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_subscription(self, info, uid: str) -> responses.DocumentSubscriptionResponse:
        felicity_user = await auth_from_info(info)

        subscription = await DocumentSubscriptionService().get(uid=uid)
        if not subscription:
            return OperationError(error=f"Document subscription with uid {uid} not found.")

        await DocumentSubscriptionService().delete(uid)
        return types.DocumentSubscriptionType(**subscription.marshal_simple())

    # Document Audit Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_audit(
            self, info, payload: inputs.DocumentAuditInputType
    ) -> responses.DocumentAuditResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "user_uid": felicity_user.uid,
            "date": payload.date or timenow_dt(),
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "date"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentAuditCreate(**incoming)
        audit = await DocumentAuditService().create(obj_in)

        return types.DocumentAuditType(**audit.marshal_simple())

    # Document Relation Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_relation(
            self, info, payload: inputs.DocumentRelationInputType
    ) -> responses.DocumentRelationResponse:
        felicity_user = await auth_from_info(info)

        # Check if source document exists
        source_document = await DocumentService().get(uid=payload.source_document)
        if not source_document:
            return OperationError(error=f"Source document with uid {payload.source_document} not found.")

        # Check if target document exists
        target_document = await DocumentService().get(uid=payload.target_document)
        if not target_document:
            return OperationError(error=f"Target document with uid {payload.target_document} not found.")

        # Prevent self-referencing
        if payload.source_document == payload.target_document:
            return OperationError(error="Document cannot be related to itself.")

        # Check if relation already exists
        exists = await DocumentService().relation_exists(
            source_uid=payload.source_document,
            target_uid=payload.target_document,
            relation_type=payload.relation_type
        )
        if exists:
            return OperationError(error="This relation already exists.")

        # Add the relation
        await DocumentService().add_relation(
            source_uid=payload.source_document,
            target_uid=payload.target_document,
            relation_type=payload.relation_type
        )

        # Create audit record for relation creation
        audit_in = schemas.DocumentAuditCreate(
            document_uid=source_document.uid,
            action=f"related_to_{target_document.document_id}",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentType(**source_document.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_relation(
            self, info, payload: inputs.DocumentRelationInputType
    ) -> responses.DocumentRelationResponse:
        felicity_user = await auth_from_info(info)

        # Check if source document exists
        source_document = await DocumentService().get(uid=payload.source_document)
        if not source_document:
            return OperationError(error=f"Source document with uid {payload.source_document} not found.")

        # Check if target document exists
        target_document = await DocumentService().get(uid=payload.target_document)
        if not target_document:
            return OperationError(error=f"Target document with uid {payload.target_document} not found.")

        # Check if relation exists
        exists = await DocumentService().relation_exists(
            source_uid=payload.source_document,
            target_uid=payload.target_document,
            relation_type=payload.relation_type
        )
        if not exists:
            return OperationError(error="This relation does not exist.")

        # Remove the relation
        await DocumentService().remove_relation(
            source_uid=payload.source_document,
            target_uid=payload.target_document,
            relation_type=payload.relation_type
        )

        # Create audit record for relation deletion
        audit_in = schemas.DocumentAuditCreate(
            document_uid=source_document.uid,
            action=f"unrelated_from_{target_document.document_id}",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentType(**source_document.marshal_simple())

    # AI Model Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_ai_model(
            self, info, payload: inputs.DocumentAIModelInputType
    ) -> responses.DocumentAIModelResponse:
        felicity_user = await auth_from_info(info)

        # Check for duplicate name
        exists = await DocumentAIModelService().get(name=payload.name)
        if exists:
            return OperationError(error=f"AI model with name '{payload.name}' already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DocumentAIModelCreate(**incoming)
        model = await DocumentAIModelService().create(obj_in)
        return types.DocumentAIModelType(**model.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_ai_model(
            self, info, uid: str, payload: inputs.DocumentAIModelUpdateInputType
    ) -> responses.DocumentAIModelResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        model = await DocumentAIModelService().get(uid=uid)
        if not model:
            return OperationError(
                error=f"AI model with uid {uid} not found. Cannot update object..."
            )

        # Check for duplicate name if changing
        if payload.name and payload.name != model.name:
            exists = await DocumentAIModelService().get(name=payload.name)
            if exists and exists.uid != uid:
                return OperationError(error=f"AI model with name '{payload.name}' already exists")

        update_data = {"updated_by_uid": felicity_user.uid}

        for field in model.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentAIModelUpdate(**update_data)
        model = await DocumentAIModelService().update(model.uid, obj_in)
        return types.DocumentAIModelType(**model.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_ai_model(self, info, uid: str) -> responses.DocumentAIModelResponse:
        model = await DocumentAIModelService().get(uid=uid)
        if not model:
            return OperationError(error=f"AI model with uid {uid} not found.")

        # Check if model is in use by authoring sessions
        sessions = await DocumentAIAuthoringSessionService().get_all(model_uid=uid)
        if sessions and len(sessions) > 0:
            return OperationError(
                error="Cannot delete AI model that is referenced by authoring sessions."
            )

        # Check if model is in use by review feedback
        feedback = await DocumentAIReviewFeedbackService().get_all(model_uid=uid)
        if feedback and len(feedback) > 0:
            return OperationError(
                error="Cannot delete AI model that is referenced by review feedback."
            )

        await DocumentAIModelService().delete(uid)
        return types.DocumentAIModelType(**model.marshal_simple())

    # AI Authoring Session Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_ai_authoring_session(
            self, info, payload: inputs.DocumentAIAuthoringSessionInputType
    ) -> responses.DocumentAIAuthoringSessionResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        # Check if model exists
        model = await DocumentAIModelService().get(uid=payload.model)
        if not model:
            return OperationError(error=f"AI model with uid {payload.model} not found.")

        # Check if model is active
        if not model.is_active:
            return OperationError(error=f"AI model '{model.name}' is not active.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "model_uid": payload.model,
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "model"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentAIAuthoringSessionCreate(**incoming)
        session = await DocumentAIAuthoringSessionService().create(obj_in)

        # Create audit record for AI session creation
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="ai_authoring_session_created",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentAIAuthoringSessionType(**session.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_ai_authoring_session(
            self, info, uid: str, payload: inputs.DocumentAIAuthoringSessionUpdateInputType
    ) -> responses.DocumentAIAuthoringSessionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        session = await DocumentAIAuthoringSessionService().get(uid=uid)
        if not session:
            return OperationError(
                error=f"AI authoring session with uid {uid} not found. Cannot update object..."
            )

        # Validate foreign keys if changing
        if payload.document and payload.document != session.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        if payload.model and payload.model != session.model_uid:
            model = await DocumentAIModelService().get(uid=payload.model)
            if not model:
                return OperationError(error=f"AI model with uid {payload.model} not found.")
            # Check if model is active
            if not model.is_active:
                return OperationError(error=f"AI model '{model.name}' is not active.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        # Map model to model_uid
        if payload.model is not None:
            update_data["model_uid"] = payload.model

        for field in session.to_dict():
            if field in payload.__dict__ and field not in ["document", "model"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentAIAuthoringSessionUpdate(**update_data)
        session = await DocumentAIAuthoringSessionService().update(session.uid, obj_in)

        return types.DocumentAIAuthoringSessionType(**session.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_ai_authoring_session(self, info,
                                                   uid: str) -> responses.DocumentAIAuthoringSessionResponse:
        felicity_user = await auth_from_info(info)

        session = await DocumentAIAuthoringSessionService().get(uid=uid)
        if not session:
            return OperationError(error=f"AI authoring session with uid {uid} not found.")

        # Create audit record for AI session deletion
        audit_in = schemas.DocumentAuditCreate(
            document_uid=session.document_uid,
            action="ai_authoring_session_deleted",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        await DocumentAIAuthoringSessionService().delete(uid)
        return types.DocumentAIAuthoringSessionType(**session.marshal_simple())

    # Compliance Standard Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_compliance_standard(
            self, info, payload: inputs.DocumentComplianceStandardInputType
    ) -> responses.DocumentComplianceStandardResponse:
        felicity_user = await auth_from_info(info)

        # Check for duplicate name/version combination
        exists = await DocumentComplianceStandardService().get(name=payload.name, version=payload.version)
        if exists:
            return OperationError(
                error=f"Compliance standard with name '{payload.name}' and version '{payload.version}' already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DocumentComplianceStandardCreate(**incoming)
        standard = await DocumentComplianceStandardService().create(obj_in)
        return types.DocumentComplianceStandardType(**standard.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_compliance_standard(
            self, info, uid: str, payload: inputs.DocumentComplianceStandardUpdateInputType
    ) -> responses.DocumentComplianceStandardResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        standard = await DocumentComplianceStandardService().get(uid=uid)
        if not standard:
            return OperationError(
                error=f"Compliance standard with uid {uid} not found. Cannot update object..."
            )

        # Check for duplicate name/version if changing
        if (payload.name and payload.name != standard.name) or (
                payload.version and payload.version != standard.version):
            name = payload.name or standard.name
            version = payload.version or standard.version
            exists = await DocumentComplianceStandardService().get(name=name, version=version)
            if exists and exists.uid != uid:
                return OperationError(
                    error=f"Compliance standard with name '{name}' and version '{version}' already exists")

        update_data = {"updated_by_uid": felicity_user.uid}

        for field in standard.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentComplianceStandardUpdate(**update_data)
        standard = await DocumentComplianceStandardService().update(standard.uid, obj_in)
        return types.DocumentComplianceStandardType(**standard.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_compliance_standard(self, info, uid: str) -> responses.DocumentComplianceStandardResponse:
        standard = await DocumentComplianceStandardService().get(uid=uid)
        if not standard:
            return OperationError(error=f"Compliance standard with uid {uid} not found.")

        # Check if standard is in use by compliance checks
        checks = await DocumentAIComplianceCheckService().get_all(standard_uid=uid)
        if checks and len(checks) > 0:
            return OperationError(
                error="Cannot delete compliance standard that is referenced by compliance checks."
            )

        await DocumentComplianceStandardService().delete(uid)
        return types.DocumentComplianceStandardType(**standard.marshal_simple())

    # AI Compliance Check Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_ai_compliance_check(
            self, info, payload: inputs.DocumentAIComplianceCheckInputType
    ) -> responses.DocumentAIComplianceCheckResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        # Check if standard exists
        standard = await DocumentComplianceStandardService().get(uid=payload.standard)
        if not standard:
            return OperationError(error=f"Compliance standard with uid {payload.standard} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "standard_uid": payload.standard,
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "standard", "issues"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentAIComplianceCheckCreate(**incoming)
        check = await DocumentAIComplianceCheckService().create(obj_in)

        # Create compliance issues if provided
        if payload.issues and len(payload.issues) > 0:
            for issue_data in payload.issues:
                issue_in = schemas.DocumentComplianceIssueCreate(
                    check_uid=check.uid,
                    section=issue_data.section,
                    description=issue_data.description,
                    severity=issue_data.severity,
                    suggestion=issue_data.suggestion,
                    created_by_uid=felicity_user.uid,
                    updated_by_uid=felicity_user.uid,
                )
                await DocumentComplianceIssueService().create(issue_in)

        # Create audit record for compliance check
        audit_in = schemas.DocumentAuditCreate(
            document_uid=document.uid,
            action="compliance_check_created",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        return types.DocumentAIComplianceCheckType(**check.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_ai_compliance_check(
            self, info, uid: str, payload: inputs.DocumentAIComplianceCheckUpdateInputType
    ) -> responses.DocumentAIComplianceCheckResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        check = await DocumentAIComplianceCheckService().get(uid=uid)
        if not check:
            return OperationError(
                error=f"Compliance check with uid {uid} not found. Cannot update object..."
            )

        # Validate foreign keys if changing
        if payload.document and payload.document != check.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        if payload.standard and payload.standard != check.standard_uid:
            standard = await DocumentComplianceStandardService().get(uid=payload.standard)
            if not standard:
                return OperationError(error=f"Compliance standard with uid {payload.standard} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        # Map standard to standard_uid
        if payload.standard is not None:
            update_data["standard_uid"] = payload.standard

        for field in check.to_dict():
            if field in payload.__dict__ and field not in ["document", "standard"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentAIComplianceCheckUpdate(**update_data)
        check = await DocumentAIComplianceCheckService().update(check.uid, obj_in)

        return types.DocumentAIComplianceCheckType(**check.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_ai_compliance_check(self, info, uid: str) -> responses.DocumentAIComplianceCheckResponse:
        felicity_user = await auth_from_info(info)

        check = await DocumentAIComplianceCheckService().get(uid=uid)
        if not check:
            return OperationError(error=f"Compliance check with uid {uid} not found.")

        # Delete associated compliance issues
        issues = await DocumentComplianceIssueService().get_all(check_uid=uid)
        for issue in issues:
            await DocumentComplianceIssueService().delete(issue.uid)

        # Create audit record for compliance check deletion
        audit_in = schemas.DocumentAuditCreate(
            document_uid=check.document_uid,
            action="compliance_check_deleted",
            date=timenow_dt(),
            user_uid=felicity_user.uid,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        await DocumentAuditService().create(audit_in)

        await DocumentAIComplianceCheckService().delete(uid)
        return types.DocumentAIComplianceCheckType(**check.marshal_simple())

    # Compliance Issue Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_compliance_issue(
            self, info, payload: inputs.DocumentComplianceIssueInputType
    ) -> responses.DocumentComplianceIssueResponse:
        felicity_user = await auth_from_info(info)

        # Check if compliance check exists
        check = await DocumentAIComplianceCheckService().get(uid=payload.check)
        if not check:
            return OperationError(error=f"Compliance check with uid {payload.check} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "check_uid": payload.check,
        }

        for k, v in payload.__dict__.items():
            if k != "check":  # Skip check as we've handled it
                incoming[k] = v

        obj_in = schemas.DocumentComplianceIssueCreate(**incoming)
        issue = await DocumentComplianceIssueService().create(obj_in)
        return types.DocumentComplianceIssueType(**issue.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_compliance_issue(
            self, info, uid: str, payload: inputs.DocumentComplianceIssueUpdateInputType
    ) -> responses.DocumentComplianceIssueResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        issue = await DocumentComplianceIssueService().get(uid=uid)
        if not issue:
            return OperationError(
                error=f"Compliance issue with uid {uid} not found. Cannot update object..."
            )

        # Check if compliance check exists if changing
        if payload.check and payload.check != issue.check_uid:
            check = await DocumentAIComplianceCheckService().get(uid=payload.check)
            if not check:
                return OperationError(error=f"Compliance check with uid {payload.check} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map check to check_uid
        if payload.check is not None:
            update_data["check_uid"] = payload.check

        for field in issue.to_dict():
            if field in payload.__dict__ and field != "check":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentComplianceIssueUpdate(**update_data)
        issue = await DocumentComplianceIssueService().update(issue.uid, obj_in)
        return types.DocumentComplianceIssueType(**issue.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_compliance_issue(self, info, uid: str) -> responses.DocumentComplianceIssueResponse:
        issue = await DocumentComplianceIssueService().get(uid=uid)
        if not issue:
            return OperationError(error=f"Compliance issue with uid {uid} not found.")

        await DocumentComplianceIssueService().delete(uid)
        return types.DocumentComplianceIssueType(**issue.marshal_simple())

    # AI Review Feedback Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_ai_review_feedback(
            self, info, payload: inputs.DocumentAIReviewFeedbackInputType
    ) -> responses.DocumentAIReviewFeedbackResponse:
        felicity_user = await auth_from_info(info)

        # Check if review step exists
        step = await DocumentReviewStepService().get(uid=payload.review_step)
        if not step:
            return OperationError(error=f"Review step with uid {payload.review_step} not found.")

        # Check if AI model exists
        model = await DocumentAIModelService().get(uid=payload.model)
        if not model:
            return OperationError(error=f"AI model with uid {payload.model} not found.")

        # Check if model is active
        if not model.is_active:
            return OperationError(error=f"AI model '{model.name}' is not active.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "review_step_uid": payload.review_step,
            "model_uid": payload.model,
        }

        for k, v in payload.__dict__.items():
            if k not in ["review_step", "model"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentAIReviewFeedbackCreate(**incoming)
        feedback = await DocumentAIReviewFeedbackService().create(obj_in)
        return types.DocumentAIReviewFeedbackType(**feedback.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_ai_review_feedback(
            self, info, uid: str, payload: inputs.DocumentAIReviewFeedbackUpdateInputType
    ) -> responses.DocumentAIReviewFeedbackResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        feedback = await DocumentAIReviewFeedbackService().get(uid=uid)
        if not feedback:
            return OperationError(
                error=f"AI review feedback with uid {uid} not found. Cannot update object..."
            )

        # Validate foreign keys if changing
        if payload.review_step and payload.review_step != feedback.review_step_uid:
            step = await DocumentReviewStepService().get(uid=payload.review_step)
            if not step:
                return OperationError(error=f"Review step with uid {payload.review_step} not found.")

        if payload.model and payload.model != feedback.model_uid:
            model = await DocumentAIModelService().get(uid=payload.model)
            if not model:
                return OperationError(error=f"AI model with uid {payload.model} not found.")
            # Check if model is active
            if not model.is_active:
                return OperationError(error=f"AI model '{model.name}' is not active.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map review_step to review_step_uid
        if payload.review_step is not None:
            update_data["review_step_uid"] = payload.review_step

        # Map model to model_uid
        if payload.model is not None:
            update_data["model_uid"] = payload.model

        for field in feedback.to_dict():
            if field in payload.__dict__ and field not in ["review_step", "model"]:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentAIReviewFeedbackUpdate(**update_data)
        feedback = await DocumentAIReviewFeedbackService().update(feedback.uid, obj_in)
        return types.DocumentAIReviewFeedbackType(**feedback.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_ai_review_feedback(self, info, uid: str) -> responses.DocumentAIReviewFeedbackResponse:
        feedback = await DocumentAIReviewFeedbackService().get(uid=uid)
        if not feedback:
            return OperationError(error=f"AI review feedback with uid {uid} not found.")

        await DocumentAIReviewFeedbackService().delete(uid)
        return types.DocumentAIReviewFeedbackType(**feedback.marshal_simple())

    # Document Analytics Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_document_analytics(
            self, info, payload: inputs.DocumentAnalyticsInputType
    ) -> responses.DocumentAnalyticsResponse:
        felicity_user = await auth_from_info(info)

        # Check if document exists
        document = await DocumentService().get(uid=payload.document)
        if not document:
            return OperationError(error=f"Document with uid {payload.document} not found.")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "document_uid": payload.document,
            "generated_date": payload.generated_date or timenow_dt(),
        }

        for k, v in payload.__dict__.items():
            if k not in ["document", "generated_date"]:  # Skip fields we've handled
                incoming[k] = v

        obj_in = schemas.DocumentAnalyticsCreate(**incoming)
        analytics = await DocumentAnalyticsService().create(obj_in)
        return types.DocumentAnalyticsType(**analytics.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_document_analytics(
            self, info, uid: str, payload: inputs.DocumentAnalyticsUpdateInputType
    ) -> responses.DocumentAnalyticsResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        analytics = await DocumentAnalyticsService().get(uid=uid)
        if not analytics:
            return OperationError(
                error=f"Document analytics with uid {uid} not found. Cannot update object..."
            )

        # Check if document exists if changing
        if payload.document and payload.document != analytics.document_uid:
            document = await DocumentService().get(uid=payload.document)
            if not document:
                return OperationError(error=f"Document with uid {payload.document} not found.")

        update_data = {"updated_by_uid": felicity_user.uid}

        # Map document to document_uid
        if payload.document is not None:
            update_data["document_uid"] = payload.document

        for field in analytics.to_dict():
            if field in payload.__dict__ and field != "document":
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = schemas.DocumentAnalyticsUpdate(**update_data)
        analytics = await DocumentAnalyticsService().update(analytics.uid, obj_in)
        return types.DocumentAnalyticsType(**analytics.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_document_analytics(self, info, uid: str) -> responses.DocumentAnalyticsResponse:
        analytics = await DocumentAnalyticsService().get(uid=uid)
        if not analytics:
            return OperationError(error=f"Document analytics with uid {uid} not found.")

        await DocumentAnalyticsService().delete(uid)
        return types.DocumentAnalyticsType(**analytics.marshal_simple())
