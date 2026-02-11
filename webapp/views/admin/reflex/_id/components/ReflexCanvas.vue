<script setup lang="ts">
import { ref, shallowRef, computed, watch, markRaw } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import type { Node, Edge, Connection } from '@vue-flow/core';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { Background, BackgroundVariant } from '@vue-flow/background';

// Import custom nodes
import TriggerNode from '../nodes/TriggerNode.vue';
import DecisionNode from '../nodes/DecisionNode.vue';
import RuleNode from '../nodes/RuleNode.vue';
import ActionNode from '../nodes/ActionNode.vue';

/**
 * Reflex Canvas Component
 *
 * Main visual flow editor using Vue Flow
 * Features:
 * - Drag and drop from palette
 * - Pan and zoom
 * - Connection validation
 * - Node selection
 * - Background grid
 */

interface Props {
  modelValue: {
    nodes: Node[];
    edges: Edge[];
  };
  readonly?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: { nodes: Node[]; edges: Edge[] }): void;
  (e: 'nodeClick', node: Node): void;
  (e: 'nodeDoubleClick', node: Node): void;
  (e: 'edgeClick', edge: Edge): void;
  (e: 'paneClick'): void;
  (e: 'nodesChange', nodes: Node[]): void;
  (e: 'edgesChange', edges: Edge[]): void;
  (e: 'addNodeAtPosition', nodeType: string, position: { x: number; y: number }): void;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

const emit = defineEmits<Emits>();

// Local state - using shallowRef to prevent Vue's deep reactivity from
// interfering with VueFlow's internal node state management
const nodes = shallowRef<Node[]>([...props.modelValue.nodes]);
const edges = shallowRef<Edge[]>([...props.modelValue.edges]);

// Flag to prevent circular updates: when we emit changes, skip the next watcher trigger
let skipNextWatch = false;

// Vue Flow instance
const {
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeClick,
  onPaneClick,
  onNodeDragStop,
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  fitView,
  zoomIn,
  zoomOut,
  setViewport,
  project, // For converting screen coords to canvas coords
  getNodes, // Get current nodes with actual positions from VueFlow's internal state
  updateNodeData, // Update node data in VueFlow's internal state
} = useVueFlow();

/**
 * Custom node types mapping
 * Using markRaw to prevent Vue from making these reactive (performance optimization)
 */
const nodeTypes = {
  trigger: markRaw(TriggerNode),
  decision: markRaw(DecisionNode),
  rule: markRaw(RuleNode),
  action: markRaw(ActionNode),
};

/**
 * Connection validation rules
 * Note: Decision node uses handle-based routing (validated separately below)
 */
const connectionRules: Record<string, string[]> = {
  trigger: ['decision'], // Entry point must connect to Decision
  decision: ['rule', 'action'], // Uses handles: 'rules' → Rule, 'actions' → Action
  rule: ['rule'], // Rules can chain (AND logic)
  action: [], // Actions are terminal nodes
};

/**
 * Validate connection
 *
 * @param connection - The connection to validate
 * @returns True if valid
 */
const isValidConnection = (connection: Connection): boolean => {
  if (!connection.source || !connection.target) return false;

  const sourceNode = nodes.value.find((n) => n.id === connection.source);
  const targetNode = nodes.value.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type || 'default';
  const targetType = targetNode.type || 'default';

  if (sourceType === 'decision') {
    if (connection.sourceHandle === 'rules') {
      return targetType === 'rule';
    }
    if (connection.sourceHandle === 'actions') {
      return targetType === 'action';
    }
    return false;
  }

  // Check connection rules
  const validTargets = connectionRules[sourceType];
  if (!validTargets) return false;

  return validTargets.includes(targetType);
};

/**
 * Handle new connection
 */
onConnect((params: Connection) => {
  if (!isValidConnection(params)) {
    return;
  }

  const newEdge: Edge = {
    id: `e${params.source}-${params.target}-${Date.now()}`,
    source: params.source!,
    target: params.target!,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
    type: 'default',
    animated: true,
  };

  edges.value = [...edges.value, newEdge];
  emitUpdate();
});

/**
 * Handle node click
 */
onNodeClick(({ node }) => {
  emit('nodeClick', node);
});

/**
 * Handle node double click
 */
onNodeDoubleClick(({ node }) => {
  emit('nodeDoubleClick', node);
});

/**
 * Handle edge click
 */
onEdgeClick(({ edge }) => {
  emit('edgeClick', edge);
});

/**
 * Handle pane click (deselect all)
 */
onPaneClick(() => {
  emit('paneClick');
});

/**
 * Handle node drag stop
 * emitUpdate() uses getNodes to capture current positions from VueFlow
 */
onNodeDragStop(() => {
  emitUpdate();
});

/**
 * Emit update to parent
 * Uses getNodes() to get current positions from VueFlow's internal state
 * IMPORTANT: We don't modify nodes.value here to preserve VueFlow's internal references
 */
const emitUpdate = () => {
  // Get current nodes from VueFlow's internal state (has actual positions)
  const currentNodes = getNodes.value;

  // Create a snapshot with VueFlow's current positions for emitting to parent
  // We DON'T update nodes.value here - VueFlow manages it via v-model
  const nodesSnapshot = nodes.value.map((node) => {
    const vueFlowNode = currentNodes.find((n) => n.id === node.id);
    if (vueFlowNode) {
      return {
        ...node,
        position: { x: vueFlowNode.position.x, y: vueFlowNode.position.y },
      };
    }
    return node;
  });

  // Set flag to prevent the watcher from resetting our state
  skipNextWatch = true;
  emit('update:modelValue', {
    nodes: nodesSnapshot,
    edges: edges.value,
  });
  emit('nodesChange', nodesSnapshot);
  emit('edgesChange', edges.value);
};

/**
 * Handle drag over canvas (required for drop to work)
 */
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation(); // Prevent VueFlow from consuming
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
};

/**
 * Handle drop on canvas
 */
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation(); // Prevent VueFlow from consuming

  if (!event.dataTransfer) {
    return;
  }

  // Get node type from drag data
  const nodeType = event.dataTransfer.getData('application/vueflow');

  if (!nodeType) {
    return;
  }

  // Get canvas bounds - use VueFlow element for accurate positioning
  const vueFlowEl = (event.currentTarget as HTMLElement).querySelector('.vue-flow');
  const bounds = vueFlowEl?.getBoundingClientRect() || (event.currentTarget as HTMLElement).getBoundingClientRect();

  // Convert screen coordinates to canvas coordinates
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  });


  // Emit to parent to create the node
  emit('addNodeAtPosition', nodeType, position);
};

/**
 * Sync nodes from parent (called explicitly, not via watcher)
 * This preserves VueFlow's internal state by only syncing when explicitly requested
 * Uses VueFlow's updateNodeData for reliable node data updates
 */
const syncFromParent = (newNodes: Node[], newEdges: Edge[]) => {
  // Update node data using VueFlow's internal method for each existing node
  // This ensures VueFlow's internal state is properly updated
  newNodes.forEach((newNode) => {
    const existingNode = nodes.value.find((n) => n.id === newNode.id);
    if (existingNode) {
      // Update the node data using VueFlow's internal method
      updateNodeData(newNode.id, newNode.data);
    }
  });

  // Then sync the arrays (for structural changes like add/remove)
  nodes.value = [...newNodes];
  edges.value = [...newEdges];
};

/**
 * Watch for external changes - ONLY structural changes (add/remove nodes)
 * We avoid deep watching to prevent interfering with VueFlow's internal state
 */
watch(
  () => [props.modelValue.nodes.length, props.modelValue.edges.length],
  ([newNodesLen, newEdgesLen], [oldNodesLen, oldEdgesLen]) => {
    if (skipNextWatch) {
      skipNextWatch = false;
      return;
    }

    // Only sync if nodes or edges were added/removed
    if (newNodesLen !== nodes.value.length || newEdgesLen !== edges.value.length) {
      // Check which nodes are new or removed
      const currentNodeIds = new Set(nodes.value.map((n) => n.id));
      const newNodeIds = new Set(props.modelValue.nodes.map((n) => n.id));

      const nodesAdded = props.modelValue.nodes.filter((n) => !currentNodeIds.has(n.id));
      const nodesRemoved = nodes.value.filter((n) => !newNodeIds.has(n.id));

      if (nodesAdded.length > 0 || nodesRemoved.length > 0) {
        // Structural change - sync from parent
        nodes.value = [...props.modelValue.nodes];
      }

      // Sync edges
      if (newEdgesLen !== edges.value.length) {
        edges.value = [...props.modelValue.edges];
      }
    }
  }
);

/**
 * Add node (called from palette drag)
 */
const addNode = (node: Node) => {
  nodes.value = [...nodes.value, node];
  emitUpdate();
};

/**
 * Delete selected nodes/edges
 */
const deleteSelected = () => {
  const selectedNodes = nodes.value.filter((n) => n.selected);
  const selectedEdges = edges.value.filter((e) => e.selected);

  if (selectedNodes.length > 0) {
    const nodeIds = selectedNodes.map((n) => n.id);
    nodes.value = nodes.value.filter((n) => !nodeIds.includes(n.id));
    // Also remove connected edges
    edges.value = edges.value.filter(
      (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
    );
  }

  if (selectedEdges.length > 0) {
    const edgeIds = selectedEdges.map((e) => e.id);
    edges.value = edges.value.filter((e) => !edgeIds.includes(e.id));
  }

  emitUpdate();
};

/**
 * Fit view to all nodes
 */
const fitViewToNodes = () => {
  fitView({ padding: 0.2, duration: 300 });
};

/**
 * Expose methods to parent
 */
defineExpose({
  addNode,
  deleteSelected,
  fitViewToNodes,
  zoomIn,
  zoomOut,
  setViewport,
  syncFromParent,
});
</script>

<template>
  <div
    class="reflex-canvas-container"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-zoom="1"
      :min-zoom="0.3"
      :max-zoom="1.5"
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
      :fit-view-on-init="true"
      :connection-line-style="{ stroke: 'var(--color-reflex-connection)', strokeWidth: 2 }"
      class="reflex-canvas"
    >
      <!-- Background Grid -->
      <Background
        :variant="BackgroundVariant.Dots"
        :gap="16"
        :size="1"
        pattern-color="var(--color-reflex-grid)"
      />

      <!-- Controls (Zoom, Fit View, etc.) -->
      <Controls
        :show-zoom="true"
        :show-fit-view="true"
        :show-interactive="true"
        position="bottom-left"
      />

      <!-- MiniMap -->
      <MiniMap
        :node-color="(node) => {
          if (node.type === 'trigger') return 'var(--color-reflex-trigger)';
          if (node.type === 'decision') return 'var(--color-reflex-decision)';
          if (node.type === 'rule') return 'var(--color-reflex-rule)';
          if (node.type === 'action') {
            return node.data.actionType === 'add' ? 'var(--color-reflex-action-add)' : 'var(--color-reflex-action-finalize)';
          }
          return 'var(--color-reflex-connection)';
        }"
        :node-stroke-color="() => 'var(--color-reflex-node-stroke)'"
        :node-stroke-width="2"
        position="bottom-right"
        pannable
        zoomable
      />
    </VueFlow>

    <!-- Canvas Overlay (for drop zones, hints, etc.) -->
    <div v-if="nodes.length === 0" class="canvas-empty-state">
      <div class="empty-state-content">
        <div class="text-6xl mb-4">🎯</div>
        <h3 class="text-xl font-semibold text-foreground mb-2">Start Building Your Reflex Rule</h3>
        <p class="text-muted-foreground mb-4">
          Drag a <strong class="text-primary">Trigger</strong> node from the palette to begin
        </p>
        <div class="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>💡 Tip: Use</span>
          <kbd class="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
          <span>+</span>
          <kbd class="px-2 py-1 bg-muted rounded border">Z</kbd>
          <span>to undo</span>
        </div>
      </div>
    </div>

    <!-- Readonly Overlay -->
    <div v-if="readonly" class="canvas-readonly-overlay">
      <div class="readonly-badge">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Read Only</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.reflex-canvas-container {
  @apply relative w-full h-full;
  @apply bg-muted;
}

.reflex-canvas {
  @apply w-full h-full;
}

/* Empty state */
.canvas-empty-state {
  @apply absolute inset-0 flex items-center justify-center pointer-events-none;
  z-index: 0;
}

.empty-state-content {
  @apply text-center p-8 bg-card/80 rounded-lg shadow-sm;
  @apply backdrop-blur-sm;
}

/* Readonly overlay */
.canvas-readonly-overlay {
  @apply absolute top-4 right-4 pointer-events-none;
  z-index: 10;
}

.readonly-badge {
  @apply flex items-center space-x-2 px-3 py-2 bg-warning/15 text-warning-foreground;
  @apply rounded-lg shadow-sm border border-warning/30;
  @apply text-sm font-medium;
}

/* Keyboard shortcuts */
kbd {
  @apply text-xs font-mono;
}
</style>

<style>
@reference "@/assets/css/style.css";

/* Global Vue Flow styling */
.vue-flow__node {
  @apply cursor-pointer;
}

.vue-flow__node.selected {
  @apply outline-none;
}

.vue-flow__edge {
  @apply cursor-pointer;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  @apply stroke-primary;
  stroke-width: 3;
}

.vue-flow__connection-path {
  @apply stroke-primary/70;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

/* Controls styling */
.vue-flow__controls {
  @apply bg-card shadow-lg rounded-lg border border-border;
}

.vue-flow__controls-button {
  @apply border-border;
  @apply hover:bg-muted;
}

/* MiniMap styling */
.vue-flow__minimap {
  @apply bg-card shadow-lg rounded-lg border border-border;
}
</style>
