<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Action Node Component
 *
 * Represents an action to take when rules match - add test or finalize result
 * Color: var(--color-reflex-action-add) for Add, var(--color-reflex-action-finalize) for Finalize
 * Icon: ➕ for Add, ✓ for Finalize
 */

interface Props {
  id: string;
  data: {
    actionType: 'add' | 'finalize';
    analysis?: { uid: string; name: string };
    analysis_uid?: string;
    count?: number; // For 'add' actions
    value?: string | number; // For 'finalize' actions
  };
  selected?: boolean;
}

const props = defineProps<Props>();

/**
 * Computed node colors based on action type
 */
const nodeColors = computed(() => {
  if (props.data.actionType === 'add') {
    return {
      border: 'action-border-success',
      bg: 'bg-card',
      text: 'text-success',
      badge: 'bg-success/15 text-success',
      handle: '!bg-success/100',
      ring: 'ring-ring',
      hover: 'hover:ring-ring',
      icon: '➕',
      label: 'Add Test',
    };
  }
  return {
    border: 'action-border-accent',
    bg: 'bg-card',
    text: 'text-accent',
    badge: 'bg-accent/15 text-accent',
    handle: '!bg-accent',
    ring: 'ring-ring',
    hover: 'hover:ring-ring',
    icon: '✓',
    label: 'Finalize',
  };
});

/**
 * Computed analysis name
 */
const analysisName = computed(() => {
  return props.data.analysis?.name || 'Select Analysis';
});

/**
 * Computed action summary
 */
const actionSummary = computed(() => {
  if (props.data.actionType === 'add') {
    const count = props.data.count || 1;
    return `Add ${count}× ${analysisName.value}`;
  }
  return `Finalize ${analysisName.value}`;
});

/**
 * Computed action detail
 */
const actionDetail = computed(() => {
  if (props.data.actionType === 'add') {
    return `Count: ${props.data.count || 1}`;
  }
  return `Result: ${props.data.value || 'Not set'}`;
});
</script>

<template>
  <div
    class="action-node"
    :class="[
      nodeColors.border,
      nodeColors.bg,
      {
        [`ring-2 ${nodeColors.ring} ring-offset-2`]: selected,
        [`hover:ring-1 ${nodeColors.hover}`]: !selected,
      },
    ]"
  >
    <!-- Input Handle (from Decision or Rule) -->
    <Handle
      type="target"
      :position="Position.Left"
      :class="`${nodeColors.handle} !w-3 !h-3 !border-2 !border-white`"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Action Icon -->
        <div class="text-xl" :class="nodeColors.text">
          {{ nodeColors.icon }}
        </div>
        <span class="text-xs font-semibold uppercase" :class="nodeColors.text">
          {{ nodeColors.label }}
        </span>
      </div>
      <!-- Action Type Badge -->
      <span :class="nodeColors.badge" class="px-2 py-0.5 text-xs font-medium rounded-full">
        {{ data.actionType.toUpperCase() }}
      </span>
    </div>

    <!-- Action Summary -->
    <div class="action-summary mb-2">
      <p class="text-sm font-medium text-foreground">
        {{ actionSummary }}
      </p>
    </div>

    <!-- Quick Detail -->
    <div class="text-xs text-muted-foreground">
      {{ actionDetail }}
    </div>

    <!-- Detailed View (when selected) -->
    <div v-if="selected" class="mt-3 pt-3 border-t space-y-2" :class="data.actionType === 'add' ? 'border-border' : 'border-border'">
      <!-- Analysis Details -->
      <div>
        <div class="text-xs font-semibold text-foreground">Test:</div>
        <div class="text-xs text-muted-foreground mt-1 px-2 py-1 bg-muted rounded">
          {{ analysisName }}
        </div>
      </div>

      <!-- Add Action Details -->
      <div v-if="data.actionType === 'add'">
        <div class="text-xs font-semibold text-foreground">Number of Tests to Add:</div>
        <div class="text-xs text-muted-foreground mt-1">
          <span class="px-2 py-1 bg-success/10 text-success rounded font-medium">
            {{ data.count || 1 }}
          </span>
        </div>
      </div>

      <!-- Finalize Action Details -->
      <div v-if="data.actionType === 'finalize'">
        <div class="text-xs font-semibold text-foreground">Result Value:</div>
        <div class="text-xs text-muted-foreground mt-1">
          <span class="px-2 py-1 bg-accent/10 text-accent rounded font-medium">
            {{ data.value || 'Not set' }}
          </span>
        </div>
      </div>

      <!-- Action Description -->
      <div class="text-xs text-muted-foreground italic mt-2 p-2 bg-muted rounded">
        <template v-if="data.actionType === 'add'">
          This action will automatically add {{ data.count || 1 }} new {{ analysisName }} {{ data.count === 1 ? 'test' : 'tests' }} to the sample.
        </template>
        <template v-else>
          This action will finalize the {{ analysisName }} test with the specified result value.
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.action-node {
  @apply border-2 rounded-lg shadow-md;
  @apply px-4 py-3 min-w-[220px] max-w-[280px];
  @apply transition-all duration-200;
}

.action-node:hover {
  @apply shadow-lg;
}

/* Validation states */
.action-node.node-error {
  @apply border-destructive/60 bg-destructive/10;
}

.action-node.node-warning {
  @apply border-warning/50 bg-warning/10;
}

/* Add action specific state */
.action-node.action-border-success {
  @apply border-success/50 bg-card;
}

/* Finalize action specific state */
.action-node.action-border-accent {
  @apply border-accent/50 bg-card;
}

/* Selected state */
.action-node.ring-2 {
  @apply shadow-xl;
}

/* Action summary styling */
.action-summary {
  @apply text-left;
}
</style>
