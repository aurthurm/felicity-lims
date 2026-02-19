from __future__ import annotations

from collections import defaultdict, deque

from beak.modules.contracts import ModuleManifest


class ModuleRegistry:
    def __init__(self) -> None:
        self._manifests: dict[str, ModuleManifest] = {}

    def register(self, manifest: ModuleManifest) -> None:
        if manifest.module_id in self._manifests:
            raise ValueError(f"Duplicate module id: {manifest.module_id}")
        self._manifests[manifest.module_id] = manifest

    def all_modules(self) -> dict[str, ModuleManifest]:
        return dict(self._manifests)

    def get(self, module_id: str) -> ModuleManifest:
        manifest = self._manifests.get(module_id)
        if not manifest:
            raise KeyError(f"Unknown module: {module_id}")
        return manifest

    def resolve(self, enabled_modules: list[str]) -> list[ModuleManifest]:
        ordered_ids = self._topological_sort(enabled_modules)
        return [self._manifests[module_id] for module_id in ordered_ids]

    def _topological_sort(self, enabled_modules: list[str]) -> list[str]:
        wanted = set(enabled_modules)
        if "core" not in wanted:
            wanted.add("core")

        for module_id in tuple(wanted):
            if module_id not in self._manifests:
                raise ValueError(f"Unknown module '{module_id}'")
            self._collect_dependencies(module_id, wanted)

        indegree: dict[str, int] = {mid: 0 for mid in wanted}
        graph: dict[str, list[str]] = defaultdict(list)

        for module_id in wanted:
            manifest = self._manifests[module_id]
            for dep in manifest.dependencies:
                if dep in wanted:
                    graph[dep].append(module_id)
                    indegree[module_id] += 1

        queue = deque(sorted(mid for mid, deg in indegree.items() if deg == 0))
        ordered: list[str] = []

        while queue:
            node = queue.popleft()
            ordered.append(node)
            for nxt in sorted(graph[node]):
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)

        if len(ordered) != len(wanted):
            raise ValueError("Circular module dependency detected")

        return ordered

    def _collect_dependencies(self, module_id: str, wanted: set[str]) -> None:
        manifest = self._manifests[module_id]
        for dep in manifest.dependencies:
            if dep not in self._manifests:
                raise ValueError(
                    f"Module '{module_id}' depends on unknown module '{dep}'"
                )
            if dep not in wanted:
                wanted.add(dep)
                self._collect_dependencies(dep, wanted)
