from __future__ import annotations

import ast
import inspect
from collections import defaultdict

from beak.modules.registry import ModuleRegistry


def build_graphql_field_module_map(registry: ModuleRegistry) -> dict[str, dict[str, str]]:
    mapping: dict[str, dict[str, str]] = defaultdict(dict)

    for module_id, manifest in registry.all_modules().items():
        if module_id == "core":
            continue

        for mixin in manifest.graphql.query_mixins:
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["query"], field_name, module_id)

        for mixin in manifest.graphql.mutation_mixins:
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["mutation"], field_name, module_id)

        for mixin in manifest.graphql.subscription_mixins:
            for field_name in _extract_strawberry_field_names(mixin):
                _assign(mapping["subscription"], field_name, module_id)

    return {k: dict(v) for k, v in mapping.items()}


def _assign(target: dict[str, str], field_name: str, module_id: str) -> None:
    target[field_name] = module_id
    target[_snake_to_camel(field_name)] = module_id


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
