// Vue Flow specific types and node definitions
import type { Node, Edge } from '@vue-flow/core';
import type { 
  ReflexBrain, 
  ReflexBrainCondition, 
  ReflexBrainConditionCriteria,
  ReflexBrainAction,
  ReflexBrainAddition,
  ReflexBrainFinal,
  Analysis,
  NodeType 
} from './reflex';

// Base node data interface
export interface BaseNodeData {
  label: string;
  nodeType: NodeType;
  isValid?: boolean;
  errors?: string[];
}

// Trigger node - represents the triggering analysis
export interface TriggerNodeData extends BaseNodeData {
  nodeType: 'trigger';
  analyses: Analysis[];
  level: number;
}

// Brain node - decision container
export interface BrainNodeData extends BaseNodeData {
  nodeType: 'brain';
  brainData: Partial<ReflexBrain>;
}

// Condition node - contains criteria for evaluation
export interface ConditionNodeData extends BaseNodeData {
  nodeType: 'condition';
  conditionData: Partial<ReflexBrainCondition>;
  brainId?: string;
}

// Criteria node - individual comparison rule
export interface CriteriaNodeData extends BaseNodeData {
  nodeType: 'criteria';
  criteriaData: Partial<ReflexBrainConditionCriteria>;
  conditionId?: string;
}

// Action node - container for additions and finals
export interface ActionNodeData extends BaseNodeData {
  nodeType: 'action';
  actionData: Partial<ReflexBrainAction>;
  brainId?: string;
}

// Addition node - adds new analysis
export interface AdditionNodeData extends BaseNodeData {
  nodeType: 'addition';
  additionData: Partial<ReflexBrainAddition>;
  actionId?: string;
}

// Final node - sets final value
export interface FinalNodeData extends BaseNodeData {
  nodeType: 'final';
  finalData: Partial<ReflexBrainFinal>;
  actionId?: string;
}

// Union type for all node data
export type FlowNodeData = 
  | TriggerNodeData 
  | BrainNodeData 
  | ConditionNodeData 
  | CriteriaNodeData
  | ActionNodeData 
  | AdditionNodeData 
  | FinalNodeData;

// Typed Vue Flow nodes
export type FlowNode = Node<FlowNodeData>;

// Edge with custom data
export interface FlowEdgeData {
  sourceType: NodeType;
  targetType: NodeType;
  isValid: boolean;
}

export type FlowEdge = Edge<FlowEdgeData>;

// Drag item for sidebar
export interface DragItem {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  defaultData: Partial<FlowNodeData>;
}

// Available drag items
export const DRAG_ITEMS: DragItem[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Analysis that triggers the reflex rule',
    icon: '⚡',
    defaultData: {
      label: 'Trigger Analysis',
      nodeType: 'trigger',
      analyses: [],
      level: 1,
    } as TriggerNodeData,
  },
  {
    type: 'brain',
    label: 'Brain',
    description: 'Decision logic container',
    icon: '🧠',
    defaultData: {
      label: 'Decision Brain',
      nodeType: 'brain',
      brainData: {
        description: '',
        priority: 0,
        conditions: [],
        actions: [],
      },
    } as BrainNodeData,
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Evaluation criteria group (OR logic)',
    icon: '❓',
    defaultData: {
      label: 'Condition',
      nodeType: 'condition',
      conditionData: {
        description: '',
        criteria: [],
        priority: 0,
      },
    } as ConditionNodeData,
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Actions to execute when conditions met',
    icon: '▶️',
    defaultData: {
      label: 'Action',
      nodeType: 'action',
      actionData: {
        description: '',
        add_new: [],
        finalise: [],
        priority: 0,
      },
    } as ActionNodeData,
  },
  {
    type: 'addition',
    label: 'Add Analysis',
    description: 'Add new analysis for testing',
    icon: '➕',
    defaultData: {
      label: 'Add Analysis',
      nodeType: 'addition',
      additionData: {
        count: 1,
      },
    } as AdditionNodeData,
  },
  {
    type: 'final',
    label: 'Finalize',
    description: 'Set final result value',
    icon: '✅',
    defaultData: {
      label: 'Final Result',
      nodeType: 'final',
      finalData: {
        value: '',
      },
    } as FinalNodeData,
  },
];
