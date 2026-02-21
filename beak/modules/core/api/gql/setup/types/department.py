import strawberry  # noqa


@strawberry.type
class DepartmentType:
    uid: str
    name: str | None = None
    description: str | None = None
    code: str | None = None
    laboratory_uid: str | None = None
    #
    created_by_uid: str | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_at: str | None = None
