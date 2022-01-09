import json
import logging

from felicity.database.base_class import DBModel
from sqlalchemy import Column, Integer, String, UnicodeText

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AuditLog(DBModel):
    """Model an audit log of user actions"""

    user_id = Column(Integer, doc="The ID of the user who made the change")
    target_type = Column(
        String(100), nullable=False, doc="The table name of the altered object"
    )
    target_id = Column(Integer, doc="The ID of the altered object")
    action = Column(Integer, doc="Create (1), update (2), or delete (3)")
    state_before = Column(
        UnicodeText,
        doc="Stores a JSON string representation of a dict containing the altered "
        "column names and original values",
    )
    state_after = Column(
        UnicodeText,
        doc="Stores a JSON string representation of a dict containing the altered "
        "column names and new values",
    )

    def __init__(self, target_type, target_id, action, state_before, state_after):

        self.state_after = state_after
        self.target_type = target_type
        self.target_id = target_id
        self.action = action
        self.state_before = state_before

        if isinstance(state_after, str):
            state_after = json.loads(state_after)

        try:
            updated_by_uid = state_after["updated_by_uid"]
        except (KeyError, TypeError):
            updated_by_uid = None

        self.user_id = updated_by_uid if updated_by_uid else None

    def __repr__(self):
        return "<AuditLog %r: %r -> %r>" % (self.user_id, self.target_type, self.action)

    def save(self, connection):

        state_after = self.state_after
        if isinstance(state_after, str):
            state_after = json.loads(state_after)

        state_before = self.state_before
        if isinstance(state_before, str):
            state_before = json.loads(state_before)

        if state_after:
            to_delete = []
            for key in state_after.keys():
                if state_after[key] == state_before[key]:
                    to_delete.append(key)

            for _key in to_delete:
                del state_after[_key]
                del state_before[_key]

            if len(state_after.keys()) == 1:
                if list(state_after.keys())[0] == "updated_at":
                    return

        state_after = json.dumps(state_after) if state_after else json.dumps({})
        state_before = json.dumps(state_before) if state_before else json.dumps({})

        connection.execute(
            self.__table__.insert(),
            [
                {
                    "user_id": self.user_id,
                    "target_type": self.target_type,
                    "target_id": self.target_id,
                    "action": self.action,
                    "state_before": state_before,
                    "state_after": state_after,
                }
            ],
        )
