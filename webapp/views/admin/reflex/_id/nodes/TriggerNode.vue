<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Trigger Node Component
 *
 * Represents the entry point for reflex rules - monitors specified analyses
 * Color: Blue (#3B82F6)
 * Icon: ⚡ Lightning
 */

interface Props {
  id: string;
  data: {
    level: number;
    description: string;
    analyses?: Array<{ uid: string; name: string }>;
    sample_type?: { uid: string; name: string };
  };
  selected?: boolean;
}

const props = defineProps<Props>();

/**
 * Computed analysis count
 */
const analysisCount = computed(() => props.data.analyses?.length || 0);

/**
 * Computed short description (truncate if too long)
 */
const shortDescription = computed(() => {
  const desc = props.data.description || 'No description';
  return desc.length > 50 ? desc.substring(0, 47) + '...' : desc;
});

/**
 * Get level badge color
 */
const levelBadgeColor = computed(() => {
  if (props.data.level === 1) return 'bg-blue-100 text-blue-800';
  if (props.data.level === 2) return 'bg-blue-200 text-blue-900';
  return 'bg-blue-300 text-blue-950';
});
</script>

<template>
  <div
    class="trigger-node"
    :class="{
      'ring-2 ring-blue-500 ring-offset-2': selected,
      'hover:ring-1 hover:ring-blue-300': !selected,
    }"
  >
    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Lightning Icon -->
        <div class="text-xl">⚡</div>
        <span class="text-xs font-semibold text-blue-600 uppercase">Trigger</span>
      </div>
      <!-- Level Badge -->
      <span
        :class="levelBadgeColor"
        class="px-2 py-0.5 text-xs font-medium rounded-full"
      >
        L{{ data.level }}
      </span>
    </div>

    <!-- Description -->
    <div class="mb-2">
      <p class="text-sm font-medium text-gray-800">
        {{ shortDescription }}
      </p>
    </div>

    <!-- Metadata -->
    <div class="flex items-center justify-between text-xs text-gray-600">
      <div class="flex items-center space-x-1">
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span>{{ analysisCount }} {{ analysisCount === 1 ? 'test' : 'tests' }}</span>
      </div>
      <div v-if="data.sample_type" class="text-xs text-gray-500">
        {{ data.sample_type.name }}
      </div>
    </div>

    <!-- Full Analysis List (when selected) -->
    <div v-if="selected && data.analyses && data.analyses.length > 0" class="mt-2 pt-2 border-t border-blue-100">
      <div class="text-xs font-semibold text-gray-700 mb-1">Monitored Tests:</div>
      <div class="space-y-1">
        <div
          v-for="analysis in data.analyses"
          :key="analysis.uid"
          class="text-xs text-gray-600 px-2 py-1 bg-blue-50 rounded"
        >
          {{ analysis.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.trigger-node {
  @apply bg-white border-2 border-blue-400 rounded-lg shadow-md;
  @apply px-4 py-3 min-w-[220px] max-w-[280px];
  @apply transition-all duration-200;
}

.trigger-node:hover {
  @apply shadow-lg;
}

/* Validation states */
.trigger-node.node-error {
  @apply border-red-500 bg-red-50;
}

.trigger-node.node-warning {
  @apply border-yellow-500 bg-yellow-50;
}

.trigger-node.node-valid {
  @apply border-blue-400 bg-white;
}

/* Selected state */
.trigger-node.ring-2 {
  @apply shadow-xl;
}
</style>
