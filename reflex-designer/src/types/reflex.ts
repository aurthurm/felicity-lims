// Reflex Rule System Types - Mapped from SQLAlchemy entities

export interface Analysis {
  uid: string;
  name: string;
  keyword?: string;
  description?: string;
}

export interface SampleType {
  uid: string;
  name: string;
  description?: string;
}

// Comparison operators for criteria evaluation
export type CriteriaOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';

export const OPERATOR_LABELS: Record<CriteriaOperator, string> = {
  eq: '=',
  neq: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
};

export const OPERATOR_DESCRIPTIONS: Record<CriteriaOperator, string> = {
  eq: 'Equal to',
  neq: 'Not equal to',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
};

// Criteria for condition evaluation (AND logic within a condition)
export interface ReflexBrainConditionCriteria {
  uid?: string;
  analysis_uid: string;
  analysis?: Analysis;
  reflex_brain_condition_uid?: string;
  operator: CriteriaOperator;
  value: string;
  priority: number;
}

// Condition containing multiple criteria (OR logic between conditions)
export interface ReflexBrainCondition {
  uid?: string;
  reflex_brain_uid?: string;
  description?: string;
  criteria: ReflexBrainConditionCriteria[];
  priority: number;
}

// Addition action - adds new analysis results
export interface ReflexBrainAddition {
  uid?: string;
  analysis_uid: string;
  analysis?: Analysis;
  reflex_brain_action_uid?: string;
  count: number;
}

// Final action - sets final values for analyses
export interface ReflexBrainFinal {
  uid?: string;
  analysis_uid: string;
  analysis?: Analysis;
  reflex_brain_action_uid?: string;
  value: string;
}

// Action containing additions and finalizations
export interface ReflexBrainAction {
  uid?: string;
  reflex_brain_uid?: string;
  description?: string;
  add_new: ReflexBrainAddition[];
  finalise: ReflexBrainFinal[];
  priority: number;
}

// Brain containing conditions and actions
export interface ReflexBrain {
  uid?: string;
  reflex_action_uid?: string;
  description?: string;
  conditions: ReflexBrainCondition[];
  actions: ReflexBrainAction[];
  priority: number;
}

// Action triggered by specific analyses
export interface ReflexAction {
  uid?: string;
  level: number;
  description: string;
  analyses: Analysis[];
  sample_type_uid?: string;
  sample_type?: SampleType;
  reflex_rule_uid?: string;
  brains: ReflexBrain[];
}

// Top-level reflex rule
export interface ReflexRule {
  uid?: string;
  name: string;
  description: string;
  is_active: boolean;
  priority: number;
  reflex_actions: ReflexAction[];
}

// Node types for Vue Flow
export type NodeType = 
  | 'trigger'
  | 'brain'
  | 'condition'
  | 'criteria'
  | 'action'
  | 'addition'
  | 'final';

// Connection rules - defines valid source → target connections
export const CONNECTION_RULES: Record<NodeType, NodeType[]> = {
  trigger: ['brain'],
  brain: ['condition'],
  condition: ['action'],
  criteria: [], // Criteria are embedded in conditions
  action: ['addition', 'final'],
  addition: [],
  final: [],
};

// Node colors for visual distinction
export const NODE_COLORS: Record<NodeType, { bg: string; border: string; accent: string }> = {
  trigger: { bg: '#1a1f2e', border: '#3b82f6', accent: '#60a5fa' },
  brain: { bg: '#1a1f2e', border: '#8b5cf6', accent: '#a78bfa' },
  condition: { bg: '#1a1f2e', border: '#f59e0b', accent: '#fbbf24' },
  criteria: { bg: '#252b3d', border: '#6b7280', accent: '#9ca3af' },
  action: { bg: '#1a1f2e', border: '#10b981', accent: '#34d399' },
  addition: { bg: '#1a1f2e', border: '#06b6d4', accent: '#22d3ee' },
  final: { bg: '#1a1f2e', border: '#ec4899', accent: '#f472b6' },
};

// Handle positions
export type HandlePosition = 'top' | 'right' | 'bottom' | 'left';
