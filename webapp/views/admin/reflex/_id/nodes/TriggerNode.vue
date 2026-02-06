<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

/**
 * Trigger Node Component
 *
 * Represents the entry point for reflex rules - monitors specified analyses
 * Color: var(--color-reflex-trigger)
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
  if (props.data.level === 1) return 'bg-primary/15 text-primary';
  if (props.data.level === 2) return 'bg-primary/20 text-primary';
  return 'bg-primary/30 text-primary';
});
</script>

<template>
  <div
    class="trigger-node"
    :class="{
      'ring-2 ring-ring ring-offset-2': selected,
      'hover:ring-1 hover:ring-ring': !selected,
    }"
  >
    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-primary/100 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Node Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- Lightning Icon -->
        <div class="text-xl">⚡</div>
        <span class="text-xs font-semibold text-primary uppercase">Trigger</span>
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
      <p class="text-sm font-medium text-foreground">
        {{ shortDescription }}
      </p>
    </div>

    <!-- Metadata -->
    <div class="flex items-center justify-between text-xs text-muted-foreground">
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
      <div v-if="data.sample_type" class="text-xs text-muted-foreground">
        {{ data.sample_type.name }}
      </div>
    </div>

    <!-- Full Analysis List (when selected) -->
    <div v-if="selected && data.analyses && data.analyses.length > 0" class="mt-2 pt-2 border-t border-border">
      <div class="text-xs font-semibold text-foreground mb-1">Monitored Tests:</div>
      <div class="space-y-1">
        <div
          v-for="analysis in data.analyses"
          :key="analysis.uid"
          class="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded"
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
  @apply border-2 rounded-lg shadow-md px-4 py-3 min-w-[220px] max-w-[280px] transition-all duration-200;
  background-color: var(--card);
  border-color: color-mix(in oklch, var(--primary), transparent 50%);
}

.trigger-node:hover {
  @apply shadow-lg;
}

/* Validation states */
.trigger-node.node-error {
  border-color: color-mix(in oklch, var(--destructive), transparent 40%);
  background-color: color-mix(in oklch, var(--destructive), transparent 90%);
}

.trigger-node.node-warning {
  border-color: color-mix(in oklch, var(--chart-4), transparent 50%);
  background-color: color-mix(in oklch, var(--chart-4), transparent 90%);
}

.trigger-node.node-valid {
  background-color: var(--card);
  border-color: color-mix(in oklch, var(--primary), transparent 50%);
}

/* Selected state */
.trigger-node.ring-2 {
  @apply shadow-xl;
}
</style>
