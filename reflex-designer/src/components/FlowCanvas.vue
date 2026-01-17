<script setup lang="ts">
import { markRaw } from 'vue';
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import type { Connection, NodeMouseEvent } from '@vue-flow/core';
import { useReflexDesignerStore } from '@/stores/reflexDesigner';
import { validateConnection, createNode, snapToGrid } from '@/utils/flowUtils';
import type { DragItem, FlowNodeData, NodeType } from '@/types';
import { NODE_COLORS } from '@/types';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/controls/dist/style.css';

// Import custom nodes
import TriggerNode from './nodes/TriggerNode.vue';
import BrainNode from './nodes/BrainNode.vue';
import ConditionNode from './nodes/ConditionNode.vue';
import ActionNode from './nodes/ActionNode.vue';
import AdditionNode from './nodes/AdditionNode.vue';
import FinalNode from './nodes/FinalNode.vue';

const store = useReflexDesignerStore();

const { onConnect, onNodesChange, onEdgesChange, addNodes, addEdges, project } = useVueFlow();

// Custom node types - cast to any to avoid strict typing issues with Vue Flow
const nodeTypes = {
  trigger: markRaw(TriggerNode),
  brain: markRaw(BrainNode),
  condition: markRaw(ConditionNode),
  action: markRaw(ActionNode),
  addition: markRaw(AdditionNode),
  final: markRaw(FinalNode),
} as any;

// Connection validation
function isValidConnection(connection: Connection): boolean {
  return validateConnection(connection, store.nodes);
}

// Handle new connections
onConnect((connection) => {
  if (isValidConnection(connection)) {
    const sourceNode = store.nodes.find(n => n.id === connection.source);
    const targetNode = store.nodes.find(n => n.id === connection.target);
    
    if (sourceNode && targetNode) {
      const sourceType = (sourceNode.data as FlowNodeData).nodeType;
      const targetType = (targetNode.data as FlowNodeData).nodeType;
      
      addEdges([{
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: true,
        style: {
          stroke: NODE_COLORS[sourceType].accent,
          strokeWidth: 2,
        },
        data: {
          sourceType,
          targetType,
          isValid: true,
        },
      }]);
    }
  }
});

// Sync nodes changes with store
onNodesChange((changes) => {
  // Handle position changes, selections, etc.
  changes.forEach(change => {
    if (change.type === 'position' && change.position) {
      const node = store.nodes.find(n => n.id === change.id);
      if (node) {
        node.position = change.position;
      }
    }
    if (change.type === 'select') {
      if (change.selected) {
        store.selectNode(change.id);
      }
    }
    if (change.type === 'remove') {
      store.removeNode(change.id);
    }
  });
});

// Sync edges changes with store
onEdgesChange((changes) => {
  changes.forEach(change => {
    if (change.type === 'remove') {
      store.removeEdge(change.id);
    }
  });
});

// Handle drag and drop from sidebar
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  
  if (!event.dataTransfer) return;
  
  const dataStr = event.dataTransfer.getData('application/json');
  if (!dataStr) return;
  
  const item: DragItem = JSON.parse(dataStr);
  
  // Get canvas position
  const bounds = (event.target as HTMLElement).closest('.vue-flow')?.getBoundingClientRect();
  if (!bounds) return;
  
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  });
  
  const snappedPosition = snapToGrid(position, 20);
  
  // Create the node
  const newNode = createNode(item.type, snappedPosition, item.defaultData);
  store.addNode(newNode);
  addNodes([newNode]);
}

// Handle node events
function handleNodeClick(event: NodeMouseEvent) {
  store.selectNode(event.node.id);
}

// Handle pane click (deselect)
function handlePaneClick() {
  store.selectNode(null);
}

// Minimap node color
function minimapNodeColor(node: any): string {
  const nodeType = node.data?.nodeType as NodeType;
  return NODE_COLORS[nodeType]?.border || '#6b7280';
}
</script>

<template>
  <div 
    class="flow-canvas"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <VueFlow
      v-model:nodes="store.nodes"
      v-model:edges="store.edges"
      :node-types="nodeTypes"
      :is-valid-connection="isValidConnection"
      :default-viewport="{ zoom: 1, x: 50, y: 50 }"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      :connection-line-style="{ stroke: '#6b7280', strokeWidth: 2 }"
      fit-view-on-init
      @node-click="handleNodeClick"
      @pane-click="handlePaneClick"
    >
      <!-- Background -->
      <Background 
        :gap="20" 
        :size="1" 
        pattern-color="rgba(255, 255, 255, 0.03)"
      />
      
      <!-- Controls -->
      <Controls 
        class="flow-controls"
        :show-interactive="false"
      />
      
      <!-- Minimap -->
      <MiniMap 
        class="flow-minimap"
        :node-color="minimapNodeColor"
        :mask-color="'rgba(0, 0, 0, 0.8)'"
      />
      
      <!-- Info Panel -->
      <Panel position="top-left" class="info-panel">
        <div class="panel-content">
          <div class="panel-title">
            <span class="panel-icon">📋</span>
            Reflex Action Designer
          </div>
          <div class="panel-stats">
            <span class="stat">
              <span class="stat-value">{{ store.nodes.length }}</span>
              <span class="stat-label">Nodes</span>
            </span>
            <span class="stat">
              <span class="stat-value">{{ store.edges.length }}</span>
              <span class="stat-label">Connections</span>
            </span>
            <span class="stat" :class="{ 'valid': store.isValidFlow }">
              <span class="stat-icon">{{ store.isValidFlow ? '✅' : '⚠️' }}</span>
              <span class="stat-label">{{ store.isValidFlow ? 'Valid' : 'Incomplete' }}</span>
            </span>
          </div>
        </div>
      </Panel>
      
      <!-- Help Panel -->
      <Panel position="bottom-left" class="help-panel">
        <div class="help-content">
          <div class="help-item">
            <kbd>Drag</kbd> nodes from sidebar
          </div>
          <div class="help-item">
            <kbd>Click</kbd> node to edit
          </div>
          <div class="help-item">
            <kbd>Del</kbd> to remove selected
          </div>
          <div class="help-item">
            <kbd>Scroll</kbd> to zoom
          </div>
        </div>
      </Panel>
    </VueFlow>
    
    <!-- Empty State -->
    <div v-if="store.nodes.length === 0" class="empty-state">
      <div class="empty-icon">🧬</div>
      <h3 class="empty-title">Start Building Your Reflex Rule</h3>
      <p class="empty-description">
        Drag components from the sidebar to create a reflex action workflow.
        Start with a Trigger, connect to a Brain, then add Conditions and Actions.
      </p>
      <div class="empty-flow-example">
        <span class="example-node trigger">Trigger</span>
        <span class="example-arrow">→</span>
        <span class="example-node brain">Brain</span>
        <span class="example-arrow">→</span>
        <span class="example-node condition">Condition</span>
        <span class="example-arrow">→</span>
        <span class="example-node action">Action</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow-canvas {
  flex: 1;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #0a0d14 0%, #111827 100%);
}

.flow-canvas :deep(.vue-flow) {
  height: 100%;
}

.flow-canvas :deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

.flow-canvas :deep(.vue-flow__connection-line) {
  stroke: #6b7280;
  stroke-width: 2;
  stroke-dasharray: 5 5;
}

/* Controls styling */
.flow-controls {
  background: rgba(15, 18, 25, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

.flow-canvas :deep(.vue-flow__controls-button) {
  background: transparent !important;
  border: none !important;
  color: #9ca3af !important;
  width: 32px !important;
  height: 32px !important;
}

.flow-canvas :deep(.vue-flow__controls-button:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

/* Minimap styling */
.flow-minimap {
  background: rgba(15, 18, 25, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

/* Info Panel */
.info-panel {
  margin: 16px !important;
}

.panel-content {
  background: rgba(15, 18, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #f3f4f6;
  margin-bottom: 12px;
}

.panel-icon {
  font-size: 16px;
}

.panel-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  font-family: 'JetBrains Mono', monospace;
}

.stat-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  font-size: 16px;
}

.stat.valid .stat-icon {
  color: #10b981;
}

/* Help Panel */
.help-panel {
  margin: 16px !important;
}

.help-content {
  display: flex;
  gap: 16px;
  background: rgba(15, 18, 25, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 16px;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6b7280;
}

.help-item kbd {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #9ca3af;
}

/* Empty State */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  max-width: 500px;
  padding: 40px;
  pointer-events: none;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 12px;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px;
}

.empty-flow-example {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.example-node {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.example-node.trigger {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.example-node.brain {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.example-node.condition {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.example-node.action {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.example-arrow {
  color: #4b5563;
  font-size: 16px;
}
</style>
