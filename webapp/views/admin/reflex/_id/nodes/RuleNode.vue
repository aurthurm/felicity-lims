<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Rule Node Component
 *
 * Represents a condition criterion - compares analysis result to a value
 * Color: var(--color-reflex-rule)
 * Icon: ⚖️ Scale
 */

interface Props {
  id: string;
  data: {
    analysis?: { uid: string; name: string };
    analysis_uid?: string;
    operator: string;
    value: string | number;
    connector?: 'AND' | 'OR';
    priority?: number;
  };
  selected?: boolean;
}

const props = defineProps<Props>();

/**
 * Operator display map
 */
const operatorDisplay: Record<string, string> = {
  '=': '=',
  '!=': '≠',
  '>': '>',
  '<': '<',
  '>=': '≥',
  '<=': '≤',
  contains: 'contains',
  not_contains: 'not contains',
};

/**
 * Computed operator symbol
 */
const operatorSymbol = computed(() => {
  return operatorDisplay[props.data.operator] || props.data.operator;
});

/**
 * Computed analysis name
 */
const analysisName = computed(() => {
  return props.data.analysis?.name || 'Select Analysis';
});

/**
 * Computed rule expression
 */
const ruleExpression = computed(() => {
  return `${analysisName.value} ${operatorSymbol.value} ${props.data.value || '?'}`;
});

/**
 * Connector badge color
 */
const connectorBadgeColor = computed(() => {
  if (props.data.connector === 'OR') {
    return 'bg-warning/15 text-warning border-warning/40';
  }
  return 'bg-warning/15 text-warning border-warning/40';
});

/**
 * Check if value is numeric
 */
const isNumericValue = computed(() => {
  return !isNaN(Number(props.data.value));
});
</script>

<template>
  <div
    class="rule-node"
    :class="{
      'ring-2 ring-warning ring-offset-2': selected,
      'hover:ring-1 hover:ring-warning/60': !selected,
    }"
  >
    <!-- Input Handle (from Decision or another Rule) -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!bg-warning !w-3 !h-3 !border-2 !border-background"
    />

    <!-- Output Handle (to another Rule or Action) -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-warning !w-3 !h-3 !border-2 !border-background"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Scale Icon -->
        <div class="text-warning text-lg">⚖️</div>
        <span class="text-xs font-semibold text-warning uppercase">Rule</span>
      </div>
      <!-- Connector Badge (AND/OR) -->
      <span
        v-if="data.connector"
        :class="connectorBadgeColor"
        class="px-2 py-0.5 text-xs font-bold rounded border"
      >
        {{ data.connector }}
      </span>
    </div>

    <!-- Rule Expression -->
    <div class="rule-expression">
      <div class="font-mono text-sm text-foreground bg-warning/10 px-3 py-2 rounded border border-warning/30">
        <span class="font-semibold text-foreground">{{ analysisName }}</span>
        <span class="text-warning mx-2">{{ operatorSymbol }}</span>
        <span
          class="font-semibold"
          :class="isNumericValue ? 'text-primary' : 'text-success'"
        >
          {{ data.value || '?' }}
        </span>
      </div>
    </div>

    <!-- Detailed View (when selected) -->
    <div v-if="selected" class="mt-3 pt-3 border-t border-warning/20 space-y-2">
      <!-- Analysis Details -->
      <div>
        <div class="text-xs font-semibold text-foreground">Test:</div>
        <div class="text-xs text-muted-foreground mt-1">{{ analysisName }}</div>
      </div>

      <!-- Operator Details -->
      <div>
        <div class="text-xs font-semibold text-foreground">Operator:</div>
        <div class="text-xs text-muted-foreground mt-1">
          {{ data.operator }} ({{ operatorSymbol }})
        </div>
      </div>

      <!-- Value Details -->
      <div>
        <div class="text-xs font-semibold text-foreground">Expected Value:</div>
        <div class="text-xs text-muted-foreground mt-1">
          {{ data.value }}
          <span v-if="isNumericValue" class="text-primary">(numeric)</span>
          <span v-else class="text-success">(text)</span>
        </div>
      </div>

      <!-- Priority -->
      <div v-if="data.priority !== undefined">
        <div class="text-xs font-semibold text-foreground">Priority:</div>
        <div class="text-xs text-muted-foreground mt-1">{{ data.priority }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@tw";
.rule-node {
  @apply bg-card border-2 border-warning/60 rounded-lg shadow-md;
  @apply px-4 py-3 min-w-[220px] max-w-[320px];
  @apply transition-all duration-200;
}

.rule-node:hover {
  @apply shadow-lg;
}

/* Validation states */
.rule-node.node-error {
  @apply border-destructive/60 bg-destructive/10;
}

.rule-node.node-warning {
  @apply border-warning/50 bg-warning/10;
}

.rule-node.node-valid {
  @apply border-warning/60 bg-card;
}

/* Selected state */
.rule-node.ring-2 {
  @apply shadow-xl;
}

/* Rule expression styling */
.rule-expression {
  @apply mb-2;
}
</style>
