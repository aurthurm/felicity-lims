from __future__ import annotations

import json
from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse
from graphql import OperationType, get_operation_ast, parse
from starlette.middleware.base import BaseHTTPMiddleware

from beak.modules.platform.module_access import get_enabled_modules
from beak.core.tenant_context import get_tenant_context
from beak.modules import get_registry
from beak.modules.graphql_fields import build_graphql_field_module_map

_GRAPHQL_FIELD_MODULE_MAP = build_graphql_field_module_map(get_registry())


class GraphQLModuleGuardMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path != "/beak-gql" or request.method.upper() != "POST":
            return await call_next(request)

        context = get_tenant_context()
        if not context or not context.tenant_slug:
            return await call_next(request)

        try:
            payload = await request.json()
        except json.JSONDecodeError:
            return await call_next(request)

        query = payload.get("query") if isinstance(payload, dict) else None
        operation_name = payload.get("operationName") if isinstance(payload, dict) else None
        if not query:
            return await call_next(request)

        try:
            document = parse(query)
            operation = get_operation_ast(document, operation_name)
        except Exception:
            return await call_next(request)

        if not operation or not operation.selection_set:
            return await call_next(request)

        op_type = _operation_type(operation.operation)
        field_map = _GRAPHQL_FIELD_MODULE_MAP.get(op_type, {})

        enabled_modules = await get_enabled_modules(context.tenant_slug)
        for selection in operation.selection_set.selections:
            field_name = getattr(getattr(selection, "name", None), "value", None)
            if not field_name:
                continue
            required_module = field_map.get(field_name)
            if required_module and required_module not in enabled_modules:
                return JSONResponse(
                    status_code=403,
                    content={
                        "errors": [
                            {
                                "message": (
                                    f"GraphQL field '{field_name}' requires module "
                                    f"'{required_module}' for tenant '{context.tenant_slug}'"
                                )
                            }
                        ]
                    },
                )

        return await call_next(request)


def _operation_type(operation_type: OperationType) -> str:
    if operation_type == OperationType.MUTATION:
        return "mutation"
    if operation_type == OperationType.SUBSCRIPTION:
        return "subscription"
    return "query"
