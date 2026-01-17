import { ref, computed } from 'vue';
import type { Node, Edge } from '@vue-flow/core';
import { useDebounceFn } from '@vueuse/core';

/**
 * Validation error or warning
 */
interface ValidationIssue {
  nodeId?: string;
  edgeId?: string;
  type: 'error' | 'warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  field?: string;
  code: string;
}

/**
 * Node validation result
 */
interface NodeValidationResult {
  nodeId: string;
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validation configuration
 */
interface ValidationConfig {
  debounceMs: number;
  validateOnChange: boolean;
  updateNodeClasses: boolean;
}

/**
 * Node types for reflex rules
 */
type NodeType = 'trigger' | 'decision' | 'rule' | 'action';

/**
 * Composable for real-time validation of reflex rule graphs
 *
 * Features:
 * - Validates all node types (Trigger, Decision, Rule, Action)
 * - Validates connections and graph structure
 * - Debounced validation (300ms default)
 * - Visual feedback via node classes
 * - Returns errors (blocking) and warnings (non-blocking)
 *
 * @param config - Validation configuration
 *
 * @example
 * const { validate, errors, warnings, isValid, getNodeIssues } = useReflexValidation();
 *
 * // Validate graph
 * validate(nodes.value, edges.value);
 *
 * // Check if graph is valid
 * if (isValid.value) {
 *   // Save rule
 * }
 *
 * // Get issues for specific node
 * const nodeErrors = getNodeIssues('node-123');
 */
export function useReflexValidation(config?: Partial<ValidationConfig>) {
  const defaultConfig: ValidationConfig = {
    debounceMs: 300,
    validateOnChange: true,
    updateNodeClasses: true,
  };

  const finalConfig = { ...defaultConfig, ...config };

  const errors = ref<ValidationIssue[]>([]);
  const warnings = ref<ValidationIssue[]>([]);
  const isValidating = ref(false);

  /**
   * Check if graph is valid (no errors)
   */
  const isValid = computed(() => errors.value.length === 0);

  /**
   * Get total issue count
   */
  const issueCount = computed(() => errors.value.length + warnings.value.length);

  /**
   * Get issues by severity
   */
  const criticalErrors = computed(() =>
    errors.value.filter((e) => e.severity === 'critical')
  );

  /**
   * Validate a Trigger node
   *
   * @param node - The trigger node
   * @returns Validation result
   */
  const validateTriggerNode = (node: Node): NodeValidationResult => {
    const nodeErrors: ValidationIssue[] = [];
    const nodeWarnings: ValidationIssue[] = [];

    // Must have description
    if (!node.data.description || node.data.description.trim().length === 0) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Trigger must have a description',
        field: 'description',
        code: 'TRIGGER_NO_DESCRIPTION',
      });
    }

    // Must have at least one analysis
    if (!node.data.analyses || node.data.analyses.length === 0) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Trigger must have at least one analysis selected',
        field: 'analyses',
        code: 'TRIGGER_NO_ANALYSES',
      });
    }

    // Level must be positive
    if (!node.data.level || node.data.level < 1) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'high',
        message: 'Trigger level must be a positive integer',
        field: 'level',
        code: 'TRIGGER_INVALID_LEVEL',
      });
    }

    // Warn if description is very short
    if (
      node.data.description &&
      node.data.description.trim().length < 10
    ) {
      nodeWarnings.push({
        nodeId: node.id,
        type: 'warning',
        severity: 'low',
        message: 'Trigger description is very short',
        field: 'description',
        code: 'TRIGGER_SHORT_DESCRIPTION',
      });
    }

    return {
      nodeId: node.id,
      isValid: nodeErrors.length === 0,
      errors: nodeErrors,
      warnings: nodeWarnings,
    };
  };

  /**
   * Validate a Decision node
   *
   * @param node - The decision node
   * @param edges - All edges (to check connections)
   * @returns Validation result
   */
  const validateDecisionNode = (node: Node, edges: Edge[]): NodeValidationResult => {
    const nodeErrors: ValidationIssue[] = [];
    const nodeWarnings: ValidationIssue[] = [];

    // Must have description
    if (!node.data.description || node.data.description.trim().length === 0) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'high',
        message: 'Decision should have a description',
        field: 'description',
        code: 'DECISION_NO_DESCRIPTION',
      });
    }

    // Must have at least one outgoing connection (to rules or actions)
    const outgoingEdges = edges.filter((e) => e.source === node.id);
    if (outgoingEdges.length === 0) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Decision must have at least one rule or action',
        code: 'DECISION_NO_OUTPUTS',
      });
    }

    // Priority must be valid
    if (node.data.priority !== undefined && node.data.priority < 0) {
      nodeWarnings.push({
        nodeId: node.id,
        type: 'warning',
        severity: 'medium',
        message: 'Decision priority should be non-negative',
        field: 'priority',
        code: 'DECISION_INVALID_PRIORITY',
      });
    }

    return {
      nodeId: node.id,
      isValid: nodeErrors.length === 0,
      errors: nodeErrors,
      warnings: nodeWarnings,
    };
  };

  /**
   * Validate a Rule node (condition criteria)
   *
   * @param node - The rule node
   * @returns Validation result
   */
  const validateRuleNode = (node: Node): NodeValidationResult => {
    const nodeErrors: ValidationIssue[] = [];
    const nodeWarnings: ValidationIssue[] = [];

    // Must have analysis selected
    if (!node.data.analysis_uid) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Rule must have an analysis selected',
        field: 'analysis_uid',
        code: 'RULE_NO_ANALYSIS',
      });
    }

    // Must have operator
    const validOperators = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains'];
    if (!node.data.operator) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Rule must have an operator',
        field: 'operator',
        code: 'RULE_NO_OPERATOR',
      });
    } else if (!validOperators.includes(node.data.operator)) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'high',
        message: `Invalid operator: ${node.data.operator}`,
        field: 'operator',
        code: 'RULE_INVALID_OPERATOR',
      });
    }

    // Must have value
    if (
      node.data.value === undefined ||
      node.data.value === null ||
      node.data.value === ''
    ) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Rule must have a value',
        field: 'value',
        code: 'RULE_NO_VALUE',
      });
    }

    // Warn for numeric operators with non-numeric values
    if (['>', '<', '>=', '<='].includes(node.data.operator)) {
      if (node.data.value && isNaN(Number(node.data.value))) {
        nodeWarnings.push({
          nodeId: node.id,
          type: 'warning',
          severity: 'medium',
          message: 'Numeric operator used with non-numeric value',
          field: 'value',
          code: 'RULE_NUMERIC_MISMATCH',
        });
      }
    }

    return {
      nodeId: node.id,
      isValid: nodeErrors.length === 0,
      errors: nodeErrors,
      warnings: nodeWarnings,
    };
  };

  /**
   * Validate an Action node
   *
   * @param node - The action node
   * @returns Validation result
   */
  const validateActionNode = (node: Node): NodeValidationResult => {
    const nodeErrors: ValidationIssue[] = [];
    const nodeWarnings: ValidationIssue[] = [];

    // Must have analysis selected
    if (!node.data.analysis_uid) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Action must have an analysis selected',
        field: 'analysis_uid',
        code: 'ACTION_NO_ANALYSIS',
      });
    }

    // Must have action type
    const validActionTypes = ['add', 'finalize'];
    if (!node.data.actionType) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'critical',
        message: 'Action must have a type (add or finalize)',
        field: 'actionType',
        code: 'ACTION_NO_TYPE',
      });
    } else if (!validActionTypes.includes(node.data.actionType)) {
      nodeErrors.push({
        nodeId: node.id,
        type: 'error',
        severity: 'high',
        message: `Invalid action type: ${node.data.actionType}`,
        field: 'actionType',
        code: 'ACTION_INVALID_TYPE',
      });
    }

    // For 'add' actions, count must be positive
    if (node.data.actionType === 'add') {
      if (!node.data.count || node.data.count < 1) {
        nodeErrors.push({
          nodeId: node.id,
          type: 'error',
          severity: 'high',
          message: 'Add action count must be at least 1',
          field: 'count',
          code: 'ACTION_INVALID_COUNT',
        });
      }
    }

    // For 'finalize' actions, value must be provided
    if (node.data.actionType === 'finalize') {
      if (
        node.data.value === undefined ||
        node.data.value === null ||
        node.data.value === ''
      ) {
        nodeErrors.push({
          nodeId: node.id,
          type: 'error',
          severity: 'high',
          message: 'Finalize action must have a value',
          field: 'value',
          code: 'ACTION_NO_VALUE',
        });
      }
    }

    return {
      nodeId: node.id,
      isValid: nodeErrors.length === 0,
      errors: nodeErrors,
      warnings: nodeWarnings,
    };
  };

  /**
   * Validate connections between nodes
   *
   * @param nodes - All nodes
   * @param edges - All edges
   * @returns Validation issues
   */
  const validateConnections = (
    nodes: Node[],
    edges: Edge[]
  ): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Check each edge
    for (const edge of edges) {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (!sourceNode || !targetNode) {
        issues.push({
          edgeId: edge.id,
          type: 'error',
          severity: 'critical',
          message: 'Connection has invalid source or target',
          code: 'CONNECTION_INVALID_NODES',
        });
        continue;
      }

      const sourceType = sourceNode.type as NodeType;
      const targetType = targetNode.type as NodeType;

      // Validate connection rules
      const validConnections: Record<NodeType, NodeType[]> = {
        trigger: ['decision'],
        decision: ['rule', 'action'],
        rule: ['rule', 'action'], // Rules can chain (AND logic)
        action: [], // Actions have no outgoing connections
      };

      if (!validConnections[sourceType]?.includes(targetType)) {
        issues.push({
          edgeId: edge.id,
          type: 'error',
          severity: 'high',
          message: `Invalid connection: ${sourceType} cannot connect to ${targetType}`,
          code: 'CONNECTION_INVALID_TYPE',
        });
      }
    }

    // Check for orphaned nodes (no incoming edges)
    const nodesWithIncoming = new Set(edges.map((e) => e.target));
    const triggerNodes = nodes.filter((n) => n.type === 'trigger');

    for (const node of nodes) {
      if (node.type !== 'trigger' && !nodesWithIncoming.has(node.id)) {
        issues.push({
          nodeId: node.id,
          type: 'warning',
          severity: 'medium',
          message: 'Node is not connected (orphaned)',
          code: 'NODE_ORPHANED',
        });
      }
    }

    // Check for cycles (should not exist)
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoing = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoing) {
        if (!visited.has(edge.target)) {
          if (hasCycle(edge.target)) return true;
        } else if (recursionStack.has(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id) && hasCycle(node.id)) {
        issues.push({
          type: 'error',
          severity: 'critical',
          message: 'Circular dependency detected in graph',
          code: 'GRAPH_CIRCULAR_DEPENDENCY',
        });
        break;
      }
    }

    // Warn if no trigger nodes
    if (triggerNodes.length === 0) {
      issues.push({
        type: 'error',
        severity: 'critical',
        message: 'Graph must have at least one trigger node',
        code: 'GRAPH_NO_TRIGGERS',
      });
    }

    return issues;
  };

  /**
   * Update node classes for visual feedback
   *
   * @param nodes - All nodes
   * @param validationResults - Validation results per node
   */
  const updateNodeClasses = (
    nodes: Node[],
    validationResults: Map<string, NodeValidationResult>
  ): Node[] => {
    return nodes.map((node) => {
      const result = validationResults.get(node.id);
      if (!result) return node;

      const classes = [];

      if (result.errors.length > 0) {
        classes.push('node-error');
      } else if (result.warnings.length > 0) {
        classes.push('node-warning');
      } else {
        classes.push('node-valid');
      }

      // Add severity class for most severe issue
      const allIssues = [...result.errors, ...result.warnings];
      if (allIssues.length > 0) {
        const mostSevere = allIssues.reduce((prev, curr) =>
          curr.severity > prev.severity ? curr : prev
        );
        classes.push(`node-severity-${mostSevere.severity}`);
      }

      return {
        ...node,
        class: classes.join(' '),
      };
    });
  };

  /**
   * Validate entire graph
   *
   * @param nodes - All nodes
   * @param edges - All edges
   * @returns Updated nodes with validation classes
   */
  const validateGraph = (nodes: Node[], edges: Edge[]): Node[] => {
    isValidating.value = true;

    const allErrors: ValidationIssue[] = [];
    const allWarnings: ValidationIssue[] = [];
    const validationResults = new Map<string, NodeValidationResult>();

    // Validate each node by type
    for (const node of nodes) {
      let result: NodeValidationResult;

      switch (node.type as NodeType) {
        case 'trigger':
          result = validateTriggerNode(node);
          break;
        case 'decision':
          result = validateDecisionNode(node, edges);
          break;
        case 'rule':
          result = validateRuleNode(node);
          break;
        case 'action':
          result = validateActionNode(node);
          break;
        default:
          result = {
            nodeId: node.id,
            isValid: false,
            errors: [
              {
                nodeId: node.id,
                type: 'error',
                severity: 'high',
                message: `Unknown node type: ${node.type}`,
                code: 'NODE_UNKNOWN_TYPE',
              },
            ],
            warnings: [],
          };
      }

      validationResults.set(node.id, result);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    // Validate connections
    const connectionIssues = validateConnections(nodes, edges);
    for (const issue of connectionIssues) {
      if (issue.type === 'error') {
        allErrors.push(issue);
      } else {
        allWarnings.push(issue);
      }
    }

    // Update reactive state
    errors.value = allErrors;
    warnings.value = allWarnings;

    isValidating.value = false;

    // Update node classes if enabled
    if (finalConfig.updateNodeClasses) {
      return updateNodeClasses(nodes, validationResults);
    }

    return nodes;
  };

  /**
   * Debounced validation
   */
  const debouncedValidate = useDebounceFn(
    (nodes: Node[], edges: Edge[]) => validateGraph(nodes, edges),
    finalConfig.debounceMs
  );

  /**
   * Main validate function (uses debouncing)
   *
   * @param nodes - All nodes
   * @param edges - All edges
   * @returns Updated nodes with validation classes
   */
  const validate = (nodes: Node[], edges: Edge[]): Node[] => {
    if (finalConfig.validateOnChange) {
      return debouncedValidate(nodes, edges) || nodes;
    }
    return validateGraph(nodes, edges);
  };

  /**
   * Validate immediately (skip debouncing)
   *
   * @param nodes - All nodes
   * @param edges - All edges
   * @returns Updated nodes with validation classes
   */
  const validateImmediate = (nodes: Node[], edges: Edge[]): Node[] => {
    return validateGraph(nodes, edges);
  };

  /**
   * Get validation issues for a specific node
   *
   * @param nodeId - Node ID
   * @returns Issues for the node
   */
  const getNodeIssues = (nodeId: string): ValidationIssue[] => {
    return [...errors.value, ...warnings.value].filter(
      (issue) => issue.nodeId === nodeId
    );
  };

  /**
   * Get validation issues for a specific edge
   *
   * @param edgeId - Edge ID
   * @returns Issues for the edge
   */
  const getEdgeIssues = (edgeId: string): ValidationIssue[] => {
    return [...errors.value, ...warnings.value].filter(
      (issue) => issue.edgeId === edgeId
    );
  };

  /**
   * Clear all validation results
   */
  const clearValidation = () => {
    errors.value = [];
    warnings.value = [];
  };

  return {
    // State
    errors,
    warnings,
    isValidating,
    isValid,
    issueCount,
    criticalErrors,

    // Methods
    validate,
    validateImmediate,
    getNodeIssues,
    getEdgeIssues,
    clearValidation,
  };
}
