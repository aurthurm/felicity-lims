<script setup lang="ts">
import { PropType, computed } from 'vue';

interface SampleCost {
  profiles: Array<{ name: string; price: number }>;
  analyses: Array<{ name: string; price: number }>;
  subtotal: number;
}

const props = defineProps({
  sampleCosts: {
    type: Array as PropType<SampleCost[]>,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency
  }).format(amount);
};

const hasCosts = computed(() => {
  return props.sampleCosts.some(cost => cost.subtotal > 0);
});
</script>

<template>
  <div class="bg-muted rounded-lg p-6 mt-6 border border-border">
    <h3 class="text-lg font-semibold text-foreground mb-4">Cost Summary</h3>

    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="h-4 bg-background rounded w-3/4"></div>
      <div class="h-4 bg-background rounded w-1/2"></div>
      <div class="h-6 bg-background rounded w-full mt-4"></div>
    </div>

    <!-- Cost summary content -->
    <div v-else-if="hasCosts">
      <!-- Per-sample breakdown -->
      <div class="space-y-2 mb-4">
        <div
          v-for="(cost, index) in sampleCosts"
          :key="index"
          class="flex justify-between items-center text-sm"
        >
          <span class="text-foreground">Sample {{ index + 1 }}:</span>
          <span class="font-medium text-foreground">
            {{ formatCurrency(cost.subtotal) }}
          </span>
        </div>
      </div>

      <!-- Grand total -->
      <div class="border-t border-border pt-4 mt-4">
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-foreground">Total:</span>
          <span class="text-2xl font-bold text-primary">
            {{ formatCurrency(grandTotal) }}
          </span>
        </div>
      </div>

      <!-- Note -->
      <div class="mt-4 text-xs text-muted-foreground italic">
        * Final cost may vary after discounts and adjustments are applied
      </div>
    </div>

    <!-- No costs message -->
    <div v-else class="text-muted-foreground italic text-sm">
      No tests selected. Add profiles or analyses to see cost breakdown.
    </div>
  </div>
</template>

<style scoped>
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}
</style>
