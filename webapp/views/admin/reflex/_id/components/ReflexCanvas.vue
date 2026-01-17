<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { VueFlow, useVueFlow, Controls, MiniMap, Background } from '@vue-flow/core';
import { BackgroundVariant } from '@vue-flow/core';
import type { Node, Edge, Connection, NodeDragEvent } from '@vue-flow/core';

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
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

const emit = defineEmits<Emits>();

// Local state
const nodes = ref<Node[]>(props.modelValue.nodes);
const edges = ref<Edge[]>(props.modelValue.edges);

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
} = useVueFlow();

/**
 * Custom node types mapping
 */
const nodeTypes = {
  trigger: TriggerNode,
  decision: DecisionNode,
  rule: RuleNode,
  action: ActionNode,
};

/**
 * Connection validation rules
 */
const connectionRules: Record<string, string[]> = {
  trigger: ['decision'],
  decision: ['rule', 'action'],
  rule: ['rule', 'action'], // Rules can chain (AND logic)
  action: [], // Actions have no outgoing connections
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
    console.warn('Invalid connection:', params);
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
 * Handle node drag stop (update position)
 */
onNodeDragStop((event: NodeDragEvent) => {
  emitUpdate();
});

/**
 * Emit update to parent
 */
const emitUpdate = () => {
  emit('update:modelValue', {
    nodes: nodes.value,
    edges: edges.value,
  });
  emit('nodesChange', nodes.value);
  emit('edgesChange', edges.value);
};

/**
 * Watch for external changes
 */
watch(
  () => props.modelValue,
  (newValue) => {
    nodes.value = newValue.nodes;
    edges.value = newValue.edges;
  },
  { deep: true }
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
});
</script>

<template>
  <div class="reflex-canvas-container">
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
      :connection-line-style="{ stroke: '#94a3b8', strokeWidth: 2 }"
      class="reflex-canvas"
    >
      <!-- Background Grid -->
      <Background
        :variant="BackgroundVariant.Dots"
        :gap="16"
        :size="1"
        pattern-color="#e2e8f0"
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
          if (node.type === 'trigger') return '#3B82F6';
          if (node.type === 'decision') return '#8B5CF6';
          if (node.type === 'rule') return '#F59E0B';
          if (node.type === 'action') {
            return node.data.actionType === 'add' ? '#10B981' : '#EC4899';
          }
          return '#94a3b8';
        }"
        :node-stroke-color="() => '#fff'"
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
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Start Building Your Reflex Rule</h3>
        <p class="text-gray-600 mb-4">
          Drag a <strong class="text-blue-600">Trigger</strong> node from the palette to begin
        </p>
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span>💡 Tip: Use</span>
          <kbd class="px-2 py-1 bg-gray-100 rounded border">Ctrl</kbd>
          <span>+</span>
          <kbd class="px-2 py-1 bg-gray-100 rounded border">Z</kbd>
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
.reflex-canvas-container {
  @apply relative w-full h-full;
  @apply bg-gray-50;
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
  @apply text-center p-8 bg-white/80 rounded-lg shadow-sm;
  @apply backdrop-blur-sm;
}

/* Readonly overlay */
.canvas-readonly-overlay {
  @apply absolute top-4 right-4 pointer-events-none;
  z-index: 10;
}

.readonly-badge {
  @apply flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800;
  @apply rounded-lg shadow-sm border border-yellow-300;
  @apply text-sm font-medium;
}

/* Keyboard shortcuts */
kbd {
  @apply text-xs font-mono;
}
</style>

<style>
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
  @apply stroke-blue-500;
  stroke-width: 3;
}

.vue-flow__connection-path {
  @apply stroke-blue-400;
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
  @apply bg-white shadow-lg rounded-lg border border-gray-200;
}

.vue-flow__controls-button {
  @apply border-gray-200;
  @apply hover:bg-gray-50;
}

/* MiniMap styling */
.vue-flow__minimap {
  @apply bg-white shadow-lg rounded-lg border border-gray-200;
}
</style>
