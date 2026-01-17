<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import type { NodeType, FlowNodeData } from '@/types';
import { NODE_COLORS, CONNECTION_RULES } from '@/types';

const props = defineProps<{
  id: string;
  data: FlowNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const colors = computed(() => NODE_COLORS[props.data.nodeType]);

const hasSourceHandle = computed(() => 
  CONNECTION_RULES[props.data.nodeType]?.length > 0
);

const hasTargetHandle = computed(() => {
  // Check if any node type can connect to this one
  return Object.values(CONNECTION_RULES).some(
    targets => targets.includes(props.data.nodeType)
  );
});

const nodeIcon = computed(() => {
  const icons: Record<NodeType, string> = {
    trigger: '⚡',
    brain: '🧠',
    condition: '❓',
    criteria: '📋',
    action: '▶️',
    addition: '➕',
    final: '✅',
  };
  return icons[props.data.nodeType] || '📦';
});

const nodeTypeLabel = computed(() => {
  const labels: Record<NodeType, string> = {
    trigger: 'Trigger',
    brain: 'Brain',
    condition: 'Condition',
    criteria: 'Criteria',
    action: 'Action',
    addition: 'Add Analysis',
    final: 'Finalize',
  };
  return labels[props.data.nodeType] || 'Node';
});
</script>

<template>
  <div
    class="reflex-node"
    :class="[
      `node-${data.nodeType}`,
      { 'node-selected': selected, 'node-invalid': data.isValid === false }
    ]"
    :style="{
      '--node-bg': colors.bg,
      '--node-border': colors.border,
      '--node-accent': colors.accent,
    }"
  >
    <!-- Target Handle (Input) -->
    <Handle
      v-if="hasTargetHandle"
      type="target"
      :position="Position.Left"
      class="handle handle-target"
      :style="{ backgroundColor: colors.accent }"
    />

    <!-- Node Header -->
    <div class="node-header">
      <span class="node-icon">{{ nodeIcon }}</span>
      <span class="node-type">{{ nodeTypeLabel }}</span>
      <div class="node-actions">
        <button class="action-btn edit-btn" @click="emit('edit')" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button class="action-btn delete-btn" @click="emit('delete')" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Node Content -->
    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <slot />
    </div>

    <!-- Validation Errors -->
    <div v-if="data.errors?.length" class="node-errors">
      <div v-for="(error, i) in data.errors" :key="i" class="error-item">
        {{ error }}
      </div>
    </div>

    <!-- Source Handle (Output) -->
    <Handle
      v-if="hasSourceHandle"
      type="source"
      :position="Position.Right"
      class="handle handle-source"
      :style="{ backgroundColor: colors.accent }"
    />
  </div>
</template>

<style scoped>
.reflex-node {
  background: var(--node-bg);
  border: 2px solid var(--node-border);
  border-radius: 12px;
  min-width: 200px;
  max-width: 280px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.reflex-node:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.4),
    0 4px 6px -2px rgba(0, 0, 0, 0.3),
    0 0 20px -5px var(--node-accent);
}

.node-selected {
  border-color: var(--node-accent);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.4),
    0 4px 6px -2px rgba(0, 0, 0, 0.3),
    0 0 30px -5px var(--node-accent);
}

.node-invalid {
  border-color: #ef4444;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px 10px 0 0;
}

.node-icon {
  font-size: 16px;
}

.node-type {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--node-accent);
  flex: 1;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.reflex-node:hover .node-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.node-content {
  padding: 12px;
}

.node-label {
  font-size: 13px;
  font-weight: 500;
  color: #e5e7eb;
  word-break: break-word;
}

.node-errors {
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0 0 10px 10px;
}

.error-item {
  font-size: 11px;
  color: #fca5a5;
}

/* Handles */
.handle {
  width: 12px;
  height: 12px;
  border: 2px solid var(--node-bg);
  transition: all 0.2s ease;
}

.handle-target {
  border-radius: 50%;
}

.handle-source {
  border-radius: 3px;
}

.handle:hover {
  transform: scale(1.3);
}

/* Node type specific styles */
.node-trigger .node-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), transparent);
}

.node-brain .node-header {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), transparent);
}

.node-condition .node-header {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), transparent);
}

.node-action .node-header {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), transparent);
}

.node-addition .node-header {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), transparent);
}

.node-final .node-header {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), transparent);
}
</style>
