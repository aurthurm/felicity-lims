from __future__ import annotations

import ast
import inspect
from collections import defaultdict


def build_graphql_field_feature_map() -> dict[str, dict[str, str]]:
    """Build GraphQL root field to billing feature key map."""
    feature_mixins: dict[str, dict[str, tuple[type, ...]]] = _feature_mixins()
    mapping: dict[str, dict[str, str]] = defaultdict(dict)

    for feature_key, parts in feature_mixins.items():
        for mixin in parts.get("query", ()):
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["query"], field_name, feature_key)
        for mixin in parts.get("mutation", ()):
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["mutation"], field_name, feature_key)
        for mixin in parts.get("subscription", ()):
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["subscription"], field_name, feature_key)

    return {k: dict(v) for k, v in mapping.items()}


def _feature_mixins() -> dict[str, dict[str, tuple[type, ...]]]:
    from beak.modules.core.api.gql.billing.mutations import BillingMutations
    from beak.modules.core.api.gql.billing.query import BillingQuery
    from beak.modules.core.api.gql.document.mutations import DocumentMutations
    from beak.modules.core.api.gql.document.query import DocumentQuery
    from beak.modules.core.api.gql.grind.mutation import GrindMutations
    from beak.modules.core.api.gql.grind.query import GrindQuery
    from beak.modules.core.api.gql.inventory.mutations import InventoryMutations
    from beak.modules.core.api.gql.inventory.query import InventoryQuery
    from beak.modules.core.api.gql.reflex.mutations import ReflexRuleMutations
    from beak.modules.core.api.gql.reflex.query import ReflexRuleQuery
    from beak.modules.core.api.gql.shipment.mutations import ShipmentMutations
    from beak.modules.core.api.gql.shipment.query import ShipmentQuery
    from beak.modules.core.api.gql.storage.mutations import StorageMutations
    from beak.modules.core.api.gql.storage.query import StorageQuery
    from beak.modules.core.api.gql.worksheet.mutations import WorkSheetMutations
    from beak.modules.core.api.gql.worksheet.query import WorkSheetQuery

    return {
        "billing": {"query": (BillingQuery,), "mutation": (BillingMutations,)},
        "inventory": {"query": (InventoryQuery,), "mutation": (InventoryMutations,)},
        "storage": {"query": (StorageQuery,), "mutation": (StorageMutations,)},
        "grind": {"query": (GrindQuery,), "mutation": (GrindMutations,)},
        "document": {"query": (DocumentQuery,), "mutation": (DocumentMutations,)},
        "shipment": {"query": (ShipmentQuery,), "mutation": (ShipmentMutations,)},
        "worksheet": {"query": (WorkSheetQuery,), "mutation": (WorkSheetMutations,)},
        "reflex": {"query": (ReflexRuleQuery,), "mutation": (ReflexRuleMutations,)},
    }


def _assign(target: dict[str, str], field_name: str, feature_key: str) -> None:
    target[field_name] = feature_key
    target[_snake_to_camel(field_name)] = feature_key


def _extract_strawberry_field_names(mixin: type) -> set[str]:
    names: set[str] = set()
    try:
        source = inspect.getsource(mixin)
    except (OSError, TypeError):
        return names

    tree = ast.parse(source)
    class_node = next(
        (node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == mixin.__name__),
        None,
    )
    if class_node is None:
        return names

    for node in class_node.body:
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        if node.name.startswith("_"):
            continue
        if _has_strawberry_decorator(node.decorator_list) or _has_known_wrapper_decorator(
            node.decorator_list
        ):
            names.add(node.name)
    return names


def _has_strawberry_decorator(decorators: list[ast.expr]) -> bool:
    for decorator in decorators:
        if _decorator_matches(decorator, {"field", "mutation", "subscription", "query"}):
            return True
    return False


def _has_known_wrapper_decorator(decorators: list[ast.expr]) -> bool:
    for decorator in decorators:
        if isinstance(decorator, ast.Name) and decorator.id in {
            "tenant_query",
            "tenant_mutation",
            "admin_query",
            "admin_mutation",
        }:
            return True
        if isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Name):
            if decorator.func.id in {"tenant_mutation", "admin_mutation"}:
                return True
    return False


def _decorator_matches(decorator: ast.expr, names: set[str]) -> bool:
    call = decorator if isinstance(decorator, ast.Call) else None
    candidate = call.func if call else decorator

    if isinstance(candidate, ast.Attribute):
        return candidate.attr in names
    if isinstance(candidate, ast.Name):
        return candidate.id in names
    return False


def _snake_to_camel(name: str) -> str:
    parts = name.split("_")
    if len(parts) == 1:
        return name
    return parts[0] + "".join(part.capitalize() for part in parts[1:])
