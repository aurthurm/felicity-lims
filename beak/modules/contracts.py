from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import Callable, Iterable

from fastapi import APIRouter


class ModuleKind(StrEnum):
    CORE = "core"
    INDUSTRY = "industry"


@dataclass(frozen=True)
class GraphQLContrib:
    types: tuple[type, ...] = ()
    query_mixins: tuple[type, ...] = ()
    mutation_mixins: tuple[type, ...] = ()
    subscription_mixins: tuple[type, ...] = ()


@dataclass(frozen=True)
class ModuleManifest:
    module_id: str
    kind: ModuleKind
    dependencies: tuple[str, ...] = ()
    graphql: GraphQLContrib = field(default_factory=GraphQLContrib)
    rest_routers: tuple[APIRouter, ...] = ()
    register_events: Callable[[], None] | None = None


def as_tuple(items: Iterable[type]) -> tuple[type, ...]:
    return tuple(items)
