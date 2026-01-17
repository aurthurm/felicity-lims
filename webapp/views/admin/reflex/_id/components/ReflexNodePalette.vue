<script setup lang="ts">
import { ref } from 'vue';
import type { Node } from '@vue-flow/core';

/**
 * Reflex Node Palette Component
 *
 * Left sidebar with draggable node cards
 * Features:
 * - Four node types (Trigger, Decision, Rule, Action)
 * - Drag and drop to canvas
 * - Node descriptions and examples
 * - Collapsible sections
 */

interface Emits {
  (e: 'addNode', nodeType: string): void;
}

const emit = defineEmits<Emits>();

/**
 * Node type definitions
 */
const nodeDefinitions = [
  {
    type: 'trigger',
    icon: '⚡',
    color: 'blue',
    label: 'Trigger',
    description: 'Entry point - monitors test results',
    example: 'When HIV test is verified',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    hoverBg: 'hover:bg-blue-100',
  },
  {
    type: 'decision',
    icon: '◆',
    color: 'purple',
    label: 'Decision',
    description: 'Decision logic container',
    example: 'IF conditions THEN actions',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    hoverBg: 'hover:bg-purple-100',
  },
  {
    type: 'rule',
    icon: '⚖️',
    color: 'amber',
    label: 'Rule',
    description: 'Condition criteria',
    example: 'CD4 Count < 200',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    hoverBg: 'hover:bg-amber-100',
  },
  {
    type: 'action',
    icon: '➕',
    color: 'green',
    label: 'Action',
    description: 'Add test or finalize result',
    example: 'Add Viral Load test',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    hoverBg: 'hover:bg-green-100',
  },
];

/**
 * Collapsed sections state
 */
const collapsed = ref(false);

/**
 * Handle node drag start
 */
const onDragStart = (event: DragEvent, nodeType: string) => {
  if (!event.dataTransfer) return;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('application/vueflow', nodeType);
};

/**
 * Handle quick add (click to add at center)
 */
const handleQuickAdd = (nodeType: string) => {
  emit('addNode', nodeType);
};

/**
 * Toggle collapse
 */
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div class="node-palette" :class="{ 'palette-collapsed': collapsed }">
    <!-- Header -->
    <div class="palette-header">
      <div class="flex items-center space-x-2">
        <div class="text-lg">🎨</div>
        <h3 class="text-sm font-semibold text-gray-700">Node Palette</h3>
      </div>
      <button
        @click="toggleCollapse"
        class="p-1 hover:bg-gray-200 rounded transition-colors"
        :title="collapsed ? 'Expand palette' : 'Collapse palette'"
      >
        <svg
          class="w-4 h-4 text-gray-600 transition-transform"
          :class="{ 'rotate-180': collapsed }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Node Cards -->
    <div v-if="!collapsed" class="palette-content">
      <!-- Instructions -->
      <div class="palette-instructions">
        <p class="text-xs text-gray-600">
          <strong>Drag</strong> nodes to canvas or <strong>click</strong> to add
        </p>
      </div>

      <!-- Node Cards -->
      <div class="space-y-3">
        <div
          v-for="node in nodeDefinitions"
          :key="node.type"
          class="node-card"
          :class="[node.bgColor, node.borderColor, node.hoverBg]"
          draggable="true"
          @dragstart="onDragStart($event, node.type)"
          @click="handleQuickAdd(node.type)"
        >
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-xl">{{ node.icon }}</span>
              <span class="text-sm font-semibold" :class="node.textColor">
                {{ node.label }}
              </span>
            </div>
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <!-- Description -->
          <p class="text-xs text-gray-600 mb-1">{{ node.description }}</p>

          <!-- Example -->
          <div class="flex items-start space-x-1 text-xs text-gray-500">
            <span class="font-semibold">e.g.</span>
            <span class="italic">{{ node.example }}</span>
          </div>
        </div>
      </div>

      <!-- Connection Rules -->
      <div class="palette-help">
        <div class="text-xs font-semibold text-gray-700 mb-2">Connection Rules:</div>
        <div class="space-y-1 text-xs text-gray-600">
          <div class="flex items-center space-x-1">
            <span class="text-blue-600">⚡</span>
            <span>→</span>
            <span class="text-purple-600">◆</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-purple-600">◆</span>
            <span>→</span>
            <span class="text-amber-600">⚖️</span>
            <span>or</span>
            <span class="text-green-600">➕</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-amber-600">⚖️</span>
            <span>→</span>
            <span class="text-amber-600">⚖️</span>
            <span class="text-xs text-gray-500">(AND chain)</span>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div class="palette-shortcuts">
        <div class="text-xs font-semibold text-gray-700 mb-2">Shortcuts:</div>
        <div class="space-y-1 text-xs text-gray-600">
          <div class="flex justify-between">
            <span>Undo</span>
            <div class="flex space-x-1">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>Z</kbd>
            </div>
          </div>
          <div class="flex justify-between">
            <span>Redo</span>
            <div class="flex space-x-1">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>Shift</kbd>
              <span>+</span>
              <kbd>Z</kbd>
            </div>
          </div>
          <div class="flex justify-between">
            <span>Delete</span>
            <kbd>Del</kbd>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsed State -->
    <div v-else class="palette-collapsed-content">
      <div
        v-for="node in nodeDefinitions"
        :key="node.type"
        class="collapsed-node-icon"
        :class="[node.bgColor, node.borderColor]"
        :title="node.label"
        draggable="true"
        @dragstart="onDragStart($event, node.type)"
        @click="handleQuickAdd(node.type)"
      >
        <span class="text-xl">{{ node.icon }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-palette {
  @apply w-64 bg-white border-r border-gray-200 shadow-sm;
  @apply flex flex-col h-full overflow-hidden;
  @apply transition-all duration-300;
}

.palette-collapsed {
  @apply w-16;
}

/* Header */
.palette-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
  @apply bg-gray-50;
}

/* Content */
.palette-content {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

/* Instructions */
.palette-instructions {
  @apply px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg;
}

/* Node Card */
.node-card {
  @apply border-2 rounded-lg p-3 cursor-move;
  @apply transition-all duration-200;
  @apply hover:shadow-md hover:scale-105;
}

.node-card:active {
  @apply cursor-grabbing scale-100;
}

/* Help Section */
.palette-help {
  @apply px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg;
}

/* Shortcuts Section */
.palette-shortcuts {
  @apply px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg;
}

kbd {
  @apply px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono;
}

/* Collapsed State */
.palette-collapsed-content {
  @apply flex flex-col items-center py-4 space-y-3;
}

.collapsed-node-icon {
  @apply w-12 h-12 flex items-center justify-center rounded-lg border-2;
  @apply cursor-move transition-all duration-200;
  @apply hover:scale-110 hover:shadow-md;
}
</style>
