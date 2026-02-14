# Reflex Rules

## Overview

Reflex rules automate follow-up testing in microbiology. When certain conditions are met (e.g., organism identification or initial result), the system can automatically add new analyses or finalise results.

## Model Mapping

| Concept | Entity | Description |
|---------|--------|-------------|
| Rule bundle | ReflexRule | Named rule set |
| Trigger group | ReflexAction | Ties to analyses, defines reflex level |
| Decision branch | ReflexBrain | Conditions and actions |
| Condition (OR group) | ReflexBrainCondition | One condition in the OR set |
| Criteria (AND) | ReflexBrainConditionCriteria | Individual criteria within a condition |
| Action group | ReflexBrainAction | Add new / finalise |
| Add analysis | ReflexBrainAddition | Creates new pending result |
| Finalise | ReflexBrainFinal | Sets final value and verifies |

## Evaluation Rules

- **AND within a condition**: All criteria in a ReflexBrainCondition must pass
- **OR across conditions**: Any ReflexBrainCondition may pass
- **Idempotent per (sample_uid, reflex_brain_uid)**: Execution is deterministic
- **Newest result per analysis**: Used when evaluating criteria

## Action Execution

- **Add New**: Creates new pending results with reflex_level + 1
- **Finalise**: Creates new result, sets final value, verifies it

## Reflex Editor (VueFlow)

The admin UI represents reflex rules as a directed graph:

- **Node types**: Trigger, Condition Group, Condition, Criteria, Action Group, Add New, Finalise
- **Edges**: Enforce allowed connections (e.g., no Criteria directly from Trigger)
- **Serialization**: Graph maps to existing backend schema
- **Hydration**: Existing rule data loads into graph without data loss

## See Also

- [ReflexEngineRedesign.md](ReflexEngineRedesign.md) — Detailed design notes and VueFlow model
