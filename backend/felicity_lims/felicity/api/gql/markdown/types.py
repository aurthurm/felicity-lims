from datetime import datetime
from typing import List, Optional, Text

import strawberry  # noqa
from felicity.api.gql.setup.types import DepartmentType
from felicity.api.gql.user.types import UserType


@strawberry.type
class DocumentTagType:
    uid: int
    name: Optional[str]


@strawberry.type
class DocumentCategoryType:
    uid: int
    name: Optional[str]


@strawberry.type
class DocumentType:
    uid: int
    name: Optional[str]
    subtitle: Optional[str]
    document_id: Optional[str]
    content: Optional[Text]
    version: Optional[str]
    tags: Optional[List[DocumentTagType]]
    authors: Optional[List[UserType]]
    readers: Optional[List[UserType]]
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    category_uid: Optional[int]
    category: Optional[DocumentCategoryType]
    created_by_uid: Optional[int]
    modified_by_uid: Optional[int]
    date_archived: Optional[datetime]
    archived_by_uid: Optional[int]
    date_recalled: Optional[datetime]
    recalled_by_uid: Optional[int]
    date_effected: Optional[datetime]
    effected_by_uid: Optional[int]
    date_approved: Optional[datetime]
    approved_by_uid: Optional[int]
    last_accessed: Optional[datetime]
    last_accessed_by_uid: Optional[int]
    status: Optional[str]
