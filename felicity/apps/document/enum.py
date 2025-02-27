import enum


class DocumentState(enum.Enum):
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    RECALLED = "recalled"
    EFFECTED = "effected"
