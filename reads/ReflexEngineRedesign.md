Reflex Engine Redesign Notes
============================

Goals
-----
- Make reflex execution deterministic and idempotent per sample.
- Represent reflex rules visually as a directed graph in the admin UI.
- Preserve existing rule semantics (OR across conditions, AND within criteria).

Current Model Mapping
---------------------
- ReflexRule -> a named rule bundle.
- ReflexAction -> trigger group for one reflex level (ties to analyses).
- ReflexBrain -> decision branch with conditions/actions.
- ReflexBrainCondition -> OR group.
- ReflexBrainConditionCriteria -> AND criteria inside the condition.
- ReflexBrainAction -> action group (add new / finalise).

Proposed VueFlow Graph Model
----------------------------
- Trigger Node (ReflexAction)
  - Attributes: level, description, target analyses.
- Condition Group Node (ReflexBrain)
  - Attributes: description, priority.
- Condition Node (ReflexBrainCondition)
  - Attributes: description, priority.
- Criteria Nodes (ReflexBrainConditionCriteria)
  - Attributes: analysis_uid, operator, value.
- Action Group Node (ReflexBrainAction)
  - Attributes: description, priority.
- Action Nodes
  - Add New Analysis (ReflexBrainAddition)
  - Finalise Analysis (ReflexBrainFinal)

Edges
-----
- Trigger -> Condition Group
- Condition Group -> Condition
- Condition -> Criteria (multiple)
- Condition Group -> Action Group
- Action Group -> Add New / Finalise

UI Behavior Notes
-----------------
- Node palette: Trigger, Condition Group, Condition, Criteria, Action Group, Add New, Finalise.
- Edges enforce allowed connections (e.g., no Criteria directly from Trigger).
- Serialize graph to existing backend inputs by mapping nodes/edges to current schema.
- When editing, hydrate graph from existing rule data (no data loss).

Backend Execution Contract
--------------------------
- Execution is idempotent per (sample_uid, reflex_brain_uid).
- Use the newest result per analysis when evaluating criteria.
- Evaluation rules:
  - AND within a condition (all criteria must pass).
  - OR across conditions (any condition may pass).
- Action execution:
  - Add New creates new pending results with reflex_level + 1.
  - Finalise creates a new result, sets final value, and verifies it.

Future Backend Enhancements
---------------------------
- Optional: store a canonical graph (nodes + edges) to decouple from current schema.
- Optional: allow branching priorities (first-match vs. all-match).
- Optional: add dry-run evaluation endpoint for UI previews.
