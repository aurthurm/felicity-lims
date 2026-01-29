<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Rule Node Component
 *
 * Represents a condition criterion - compares analysis result to a value
 * Color: Amber (#F59E0B)
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
    return 'bg-orange-100 text-orange-800 border-orange-300';
  }
  return 'bg-amber-100 text-amber-800 border-amber-300';
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
      'ring-2 ring-amber-500 ring-offset-2': selected,
      'hover:ring-1 hover:ring-amber-300': !selected,
    }"
  >
    <!-- Input Handle (from Decision or another Rule) -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Output Handle (to another Rule or Action) -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Scale Icon -->
        <div class="text-amber-600 text-lg">⚖️</div>
        <span class="text-xs font-semibold text-amber-600 uppercase">Rule</span>
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
      <div class="font-mono text-sm text-gray-800 bg-amber-50 px-3 py-2 rounded border border-amber-200">
        <span class="font-semibold text-amber-900">{{ analysisName }}</span>
        <span class="text-amber-600 mx-2">{{ operatorSymbol }}</span>
        <span
          class="font-semibold"
          :class="isNumericValue ? 'text-blue-700' : 'text-green-700'"
        >
          {{ data.value || '?' }}
        </span>
      </div>
    </div>

    <!-- Detailed View (when selected) -->
    <div v-if="selected" class="mt-3 pt-3 border-t border-amber-100 space-y-2">
      <!-- Analysis Details -->
      <div>
        <div class="text-xs font-semibold text-gray-700">Test:</div>
        <div class="text-xs text-gray-600 mt-1">{{ analysisName }}</div>
      </div>

      <!-- Operator Details -->
      <div>
        <div class="text-xs font-semibold text-gray-700">Operator:</div>
        <div class="text-xs text-gray-600 mt-1">
          {{ data.operator }} ({{ operatorSymbol }})
        </div>
      </div>

      <!-- Value Details -->
      <div>
        <div class="text-xs font-semibold text-gray-700">Expected Value:</div>
        <div class="text-xs text-gray-600 mt-1">
          {{ data.value }}
          <span v-if="isNumericValue" class="text-blue-600">(numeric)</span>
          <span v-else class="text-green-600">(text)</span>
        </div>
      </div>

      <!-- Priority -->
      <div v-if="data.priority !== undefined">
        <div class="text-xs font-semibold text-gray-700">Priority:</div>
        <div class="text-xs text-gray-600 mt-1">{{ data.priority }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.rule-node {
  @apply bg-white border-2 border-amber-400 rounded-lg shadow-md;
  @apply px-4 py-3 min-w-[220px] max-w-[320px];
  @apply transition-all duration-200;
}

.rule-node:hover {
  @apply shadow-lg;
}

/* Validation states */
.rule-node.node-error {
  @apply border-red-500 bg-red-50;
}

.rule-node.node-warning {
  @apply border-yellow-500 bg-yellow-50;
}

.rule-node.node-valid {
  @apply border-amber-400 bg-white;
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
