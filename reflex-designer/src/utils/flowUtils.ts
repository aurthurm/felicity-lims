import type { Connection } from '@vue-flow/core';
import type { FlowNode, FlowNodeData, NodeType } from '@/types';
import { CONNECTION_RULES, NODE_COLORS } from '@/types';

/**
 * Validate if a connection between two nodes is allowed
 */
export function validateConnection(
  connection: Connection,
  nodes: FlowNode[]
): boolean {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = (sourceNode.data as FlowNodeData).nodeType;
  const targetType = (targetNode.data as FlowNodeData).nodeType;

  return isConnectionValid(sourceType, targetType);
}

/**
 * Check if connection between node types is valid according to rules
 */
export function isConnectionValid(
  sourceType: NodeType,
  targetType: NodeType
): boolean {
  const validTargets = CONNECTION_RULES[sourceType];
  return validTargets?.includes(targetType) ?? false;
}

/**
 * Get valid target node types for a given source type
 */
export function getValidTargets(sourceType: NodeType): NodeType[] {
  return CONNECTION_RULES[sourceType] || [];
}

/**
 * Get node colors by type
 */
export function getNodeColors(nodeType: NodeType) {
  return NODE_COLORS[nodeType] || NODE_COLORS.brain;
}

/**
 * Generate a unique node ID
 */
export function generateNodeId(prefix: string = 'node'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new node with default position
 */
export function createNode(
  type: NodeType,
  position: { x: number; y: number },
  data: Partial<FlowNodeData>
): FlowNode {
  return {
    id: generateNodeId(type),
    type,
    position,
    data: {
      label: `New ${type}`,
      nodeType: type,
      isValid: true,
      ...data,
    } as FlowNodeData,
  };
}

/**
 * Calculate grid-snapped position
 */
export function snapToGrid(
  position: { x: number; y: number },
  gridSize: number = 20
): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Get connector handle style based on source/target validity
 */
export function getHandleStyle(
  isSource: boolean,
  nodeType: NodeType,
  isConnectable: boolean = true
) {
  const colors = getNodeColors(nodeType);
  return {
    backgroundColor: isConnectable ? colors.accent : '#4b5563',
    borderColor: isConnectable ? colors.border : '#374151',
    width: isSource ? '12px' : '10px',
    height: isSource ? '12px' : '10px',
    borderRadius: isSource ? '2px' : '50%',
  };
}

/**
 * Layout nodes in a tree structure
 */
export function layoutNodes(
  nodes: FlowNode[],
  edges: { source: string; target: string }[]
): FlowNode[] {
  // Simple horizontal tree layout
  const levels: Map<string, number> = new Map();
  const positioned: Set<string> = new Set();

  // Find root nodes (no incoming edges)
  const targetIds = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(n => !targetIds.has(n.id));

  // BFS to assign levels
  const queue = rootNodes.map(n => ({ id: n.id, level: 0 }));
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (positioned.has(id)) continue;
    
    levels.set(id, level);
    positioned.add(id);

    // Find children
    const children = edges
      .filter(e => e.source === id)
      .map(e => e.target);
    
    children.forEach(childId => {
      if (!positioned.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Position nodes by level
  const levelCounts: Map<number, number> = new Map();
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 150;

  return nodes.map(node => {
    const level = levels.get(node.id) ?? 0;
    const count = levelCounts.get(level) ?? 0;
    levelCounts.set(level, count + 1);

    return {
      ...node,
      position: {
        x: level * HORIZONTAL_SPACING + 50,
        y: count * VERTICAL_SPACING + 50,
      },
    };
  });
}

/**
 * Validate the entire flow structure
 */
export function validateFlow(
  nodes: FlowNode[],
  edges: { source: string; target: string }[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for at least one trigger
  const triggers = nodes.filter(
    n => (n.data as FlowNodeData).nodeType === 'trigger'
  );
  if (triggers.length === 0) {
    errors.push('At least one Trigger node is required');
  }

  // Check for at least one brain
  const brains = nodes.filter(
    n => (n.data as FlowNodeData).nodeType === 'brain'
  );
  if (brains.length === 0) {
    errors.push('At least one Brain node is required');
  }

  // Check that all non-terminal nodes have outgoing connections
  const sourceIds = new Set(edges.map(e => e.source));
  nodes.forEach(node => {
    if (!node.data) return;
    const nodeData = node.data as FlowNodeData;
    const nodeType = nodeData.nodeType;
    const validTargets = CONNECTION_RULES[nodeType];
    
    // If this node type can have children but doesn't
    if (validTargets.length > 0 && !sourceIds.has(node.id)) {
      errors.push(`${nodeData.label} (${nodeType}) has no outgoing connections`);
    }
  });

  // Check that all connections are valid
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const sourceType = (sourceNode.data as FlowNodeData).nodeType;
      const targetType = (targetNode.data as FlowNodeData).nodeType;
      
      if (!isConnectionValid(sourceType, targetType)) {
        errors.push(
          `Invalid connection: ${sourceType} → ${targetType}`
        );
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
