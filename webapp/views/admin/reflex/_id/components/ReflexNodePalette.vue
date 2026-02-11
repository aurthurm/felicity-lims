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
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/40',
    textColor: 'text-primary',
    hoverBg: 'hover:bg-primary/15',
  },
  {
    type: 'decision',
    icon: '◆',
    color: 'purple',
    label: 'Decision',
    description: 'Decision logic container',
    example: 'IF conditions THEN actions',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/40',
    textColor: 'text-accent',
    hoverBg: 'hover:bg-accent/15',
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
    bgColor: 'bg-success/10',
    borderColor: 'border-success/40',
    textColor: 'text-success',
    hoverBg: 'hover:bg-success/15',
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
  if (!event.dataTransfer) {
    return;
  }

  event.dataTransfer.effectAllowed = 'copy';
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
      <div v-if="!collapsed" class="flex items-center space-x-2">
        <div class="text-lg">🎨</div>
        <h3 class="text-sm font-semibold text-foreground">Node Palette</h3>
      </div>
      <button
        @click="toggleCollapse"
        class="p-1 hover:bg-muted rounded transition-colors"
        :class="{ 'mx-auto': collapsed }"
        :title="collapsed ? 'Expand palette' : 'Collapse palette'"
      >
        <svg
          class="w-4 h-4 text-muted-foreground transition-transform"
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
        <p class="text-xs text-muted-foreground">
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
              class="w-4 h-4 text-muted-foreground"
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
          <p class="text-xs text-muted-foreground mb-1">{{ node.description }}</p>

          <!-- Example -->
          <div class="flex items-start space-x-1 text-xs text-muted-foreground">
            <span class="font-semibold">e.g.</span>
            <span class="italic">{{ node.example }}</span>
          </div>
        </div>
      </div>

      <!-- Connection Rules -->
      <div class="palette-help">
        <div class="text-xs font-semibold text-foreground mb-2">Connection Rules:</div>
        <div class="space-y-1 text-xs text-muted-foreground">
          <div class="flex items-center space-x-1">
            <span class="text-primary">⚡</span>
            <span>→</span>
            <span class="text-accent">◆</span>
            <span class="text-xs text-muted-foreground">(entry point)</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-accent">◆</span>
            <span class="text-amber-600">[rules]</span>
            <span>→</span>
            <span class="text-amber-600">⚖️</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-accent">◆</span>
            <span class="text-success">[actions]</span>
            <span>→</span>
            <span class="text-success">➕</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-amber-600">⚖️</span>
            <span>→</span>
            <span class="text-amber-600">⚖️</span>
            <span class="text-xs text-muted-foreground">(AND chain)</span>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div class="palette-shortcuts">
        <div class="text-xs font-semibold text-foreground mb-2">Shortcuts:</div>
        <div class="space-y-1 text-xs text-muted-foreground">
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
        <span class="text-2xl">{{ node.icon }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.node-palette {
  @apply w-64 bg-card border-r border-border shadow-sm;
  @apply flex flex-col h-full overflow-hidden;
  @apply transition-all duration-300;
}

.palette-collapsed {
  @apply w-16;
}

/* Header */
.palette-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-border;
  @apply bg-muted;
}

.palette-collapsed .palette-header {
  @apply justify-center px-2;
}

/* Content */
.palette-content {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

/* Instructions */
.palette-instructions {
  @apply px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg;
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
  @apply px-3 py-2 bg-muted border border-border rounded-lg;
}

/* Shortcuts Section */
.palette-shortcuts {
  @apply px-3 py-2 bg-muted border border-border rounded-lg;
}

kbd {
  @apply px-1.5 py-0.5 bg-card border border-input rounded text-xs font-mono;
}

/* Collapsed State */
.palette-collapsed-content {
  @apply flex flex-col items-center justify-start flex-1 space-y-3 px-2 py-4;
}

.collapsed-node-icon {
  @apply w-12 h-12 flex items-center justify-center rounded-lg border-2;
  @apply cursor-move transition-all duration-200;
  @apply hover:scale-110 hover:shadow-md flex-shrink-0;
}
</style>
