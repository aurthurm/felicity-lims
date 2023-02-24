import json
from typing import Any, NewType
import base64
import strawberry

JSONScalar = strawberry.scalar(
    NewType("JSONScalar", Any),
    serialize=lambda v: v,
    parse_value=lambda v: json.loads(v),
    description="json field",
)


class BytesEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return obj.decode('utf-8')
        return json.JSONEncoder.default(self, obj)


BytesScalar = strawberry.scalar(
    NewType("BytesScalar", bytes),
    serialize=lambda v: base64.b64encode(v).decode("utf-8"),
    parse_value=lambda v: base64.b64decode(v).encode("utf-8"),
)