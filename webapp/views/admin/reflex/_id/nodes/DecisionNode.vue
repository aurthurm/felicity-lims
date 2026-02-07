<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Decision Node Component
 *
 * Represents a decision logic container - contains rules (conditions) and actions
 * Color: violet (visible on canvas)
 * Icon: ◆ Diamond
 */

interface Props {
  id: string;
  data: {
    description?: string;
    priority: number;
    rule_groups?: Array<{
      uid: string;
      rules?: Array<{ uid: string }>;
    }>;
    add_analyses?: Array<{ uid: string }>;
    finalize_analyses?: Array<{ uid: string }>;
  };
  selected?: boolean;
}

const props = defineProps<Props>();

/**
 * Computed rule count (across all rule groups)
 */
const ruleCount = computed(() => {
  if (!props.data.rule_groups) return 0;
  return props.data.rule_groups.reduce(
    (total, group) => total + (group.rules?.length || 0),
    0
  );
});

/**
 * Computed action count
 */
const actionCount = computed(() => {
  const addCount = props.data.add_analyses?.length || 0;
  const finalizeCount = props.data.finalize_analyses?.length || 0;
  return addCount + finalizeCount;
});

/**
 * Computed short description
 */
const shortDescription = computed(() => {
  const desc = props.data.description || `Decision ${props.data.priority}`;
  return desc.length > 40 ? desc.substring(0, 37) + '...' : desc;
});

/**
 * Computed priority badge color
 */
const priorityBadgeColor = computed(() => {
  if (props.data.priority === 0 || props.data.priority === 1) {
    return 'bg-violet-100 text-violet-700';
  }
  if (props.data.priority <= 3) {
    return 'bg-violet-200 text-violet-700';
  }
  return 'bg-violet-300 text-violet-700';
});

/**
 * Decision logic summary
 */
const logicSummary = computed(() => {
  return `IF ${ruleCount.value} ${ruleCount.value === 1 ? 'rule' : 'rules'} THEN ${actionCount.value} ${actionCount.value === 1 ? 'action' : 'actions'}`;
});
</script>

<template>
  <div
    class="decision-node"
    :class="{
      'ring-2 ring-ring ring-offset-2': selected,
      'hover:ring-1 hover:ring-ring': !selected,
      'decision-node-compact': !selected,
    }"
  >
    <!-- Input Handle (from Trigger) -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!bg-violet-500 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Output Handles -->
    <Handle
      id="rules"
      type="source"
      :position="Position.Right"
      class="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      style="top: 35%;"
    />
    <Handle
      id="actions"
      type="source"
      :position="Position.Right"
      class="!bg-success/100 !w-3 !h-3 !border-2 !border-white"
      style="top: 65%;"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Diamond Icon (rotated square) -->
        <div class="text-violet-700">
          <svg class="w-5 h-5 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-violet-700 uppercase">Decision</span>
      </div>
      <!-- Priority Badge -->
      <span
        :class="priorityBadgeColor"
        class="px-2 py-0.5 text-xs font-medium rounded-full"
      >
        P{{ data.priority }}
      </span>
    </div>

    <!-- Description -->
    <div class="mb-2">
      <p class="text-sm font-medium text-foreground">
        {{ shortDescription }}
      </p>
    </div>

    <!-- Logic Summary -->
    <div class="decision-logic-summary">
      <div class="text-xs font-mono text-violet-700 bg-violet-100 px-2 py-1 rounded">
        {{ logicSummary }}
      </div>
    </div>

    <!-- Detailed View (when selected) -->
    <div v-if="selected" class="mt-3 pt-3 border-t border-border space-y-2">
      <!-- Rule Groups -->
      <div v-if="data.rule_groups && data.rule_groups.length > 0">
        <div class="text-xs font-semibold text-foreground mb-1">Conditions:</div>
        <div class="space-y-1">
          <div
            v-for="(group, index) in data.rule_groups"
            :key="group.uid"
            class="text-xs text-muted-foreground px-2 py-1 bg-violet-100 rounded"
          >
            Group {{ index + 1 }}: {{ group.rules?.length || 0 }} {{ group.rules?.length === 1 ? 'rule' : 'rules' }}
          </div>
        </div>
      </div>

      <!-- Actions Summary -->
      <div v-if="actionCount > 0">
        <div class="text-xs font-semibold text-foreground mb-1">Actions:</div>
        <div class="flex items-center space-x-2 text-xs text-muted-foreground">
          <span v-if="data.add_analyses && data.add_analyses.length > 0" class="px-2 py-1 bg-success/10 text-success rounded">
            +{{ data.add_analyses.length }} Add
          </span>
          <span v-if="data.finalize_analyses && data.finalize_analyses.length > 0" class="px-2 py-1 bg-violet-100 text-violet-700 rounded">
            ✓{{ data.finalize_analyses.length }} Finalize
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.decision-node {
  @apply border-2 rounded-lg shadow-md px-4 py-3 min-w-[240px] max-w-[300px] transition-all duration-200;
  background-color: #f5f3ff; /* violet-50 */
  border-color: #c4b5fd; /* violet-300 */
}

.decision-node:hover {
  @apply shadow-lg;
}

/* Compact mode (not selected) */
.decision-node-compact {
  @apply px-3 py-2 min-w-[200px];
}

/* Validation states */
.decision-node.node-error {
  border-color: color-mix(in oklch, var(--destructive), transparent 40%);
  background-color: color-mix(in oklch, var(--destructive), transparent 90%);
}

.decision-node.node-warning {
  border-color: color-mix(in oklch, var(--chart-4), transparent 50%);
  background-color: color-mix(in oklch, var(--chart-4), transparent 90%);
}

.decision-node.node-valid {
  background-color: #f5f3ff; /* violet-50 */
  border-color: #c4b5fd; /* violet-300 */
}

/* Selected state */
.decision-node.ring-2 {
  @apply shadow-xl;
}

/* Logic summary styling */
.decision-logic-summary {
  @apply text-center;
}
</style>
