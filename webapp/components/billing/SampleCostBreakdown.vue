<script setup lang="ts">
import { computed, PropType } from 'vue';
import { ProfileType, AnalysisType } from '@/types/gql';
import { useSetupStore } from '@/stores/setup';

const setupStore = useSetupStore();

const props = defineProps({
  profiles: {
    type: Array as PropType<ProfileType[]>,
    default: () => []
  },
  analyses: {
    type: Array as PropType<AnalysisType[]>,
    default: () => []
  },
  priceMap: {
    type: Map as PropType<Map<string, number>>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const currency = computed(() => setupStore.getLaboratory?.settings?.currency ?? 'USD');

const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.value
  }).format(amount);
};

const profileCosts = computed(() => {
  return props.profiles?.map(profile => ({
    name: profile.name,
    price: props.priceMap.get(`profile_${profile.uid}`) ?? null
  })) ?? [];
});

const analysisCosts = computed(() => {
  return props.analyses?.map(analysis => ({
    name: analysis.name,
    price: props.priceMap.get(`analysis_${analysis.uid}`) ?? null
  })) ?? [];
});

const subtotal = computed(() => {
  let total = 0;
  profileCosts.value.forEach(item => {
    if (item.price !== null) total += item.price;
  });
  analysisCosts.value.forEach(item => {
    if (item.price !== null) total += item.price;
  });
  return total;
});
</script>

<template>
  <div class="space-y-2 text-sm">
    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-2">
      <div class="h-4 bg-muted rounded w-3/4"></div>
      <div class="h-4 bg-muted rounded w-1/2"></div>
      <div class="h-4 bg-muted rounded w-full"></div>
    </div>

    <!-- Cost breakdown -->
    <div v-else>
      <!-- Profiles breakdown -->
      <div v-if="profileCosts.length > 0" class="space-y-1">
        <div class="text-xs font-semibold text-muted-foreground uppercase">Profiles</div>
        <div
          v-for="(item, index) in profileCosts"
          :key="`profile-${index}`"
          class="flex justify-between items-center"
        >
          <span class="text-foreground truncate flex-1 mr-2">{{ item.name }}</span>
          <span :class="item.price === null ? 'text-destructive' : 'text-foreground font-medium'">
            {{ formatCurrency(item.price) }}
          </span>
        </div>
      </div>

      <!-- Analyses breakdown -->
      <div v-if="analysisCosts.length > 0" class="space-y-1" :class="{ 'mt-3': profileCosts.length > 0 }">
        <div class="text-xs font-semibold text-muted-foreground uppercase">Analyses</div>
        <div
          v-for="(item, index) in analysisCosts"
          :key="`analysis-${index}`"
          class="flex justify-between items-center"
        >
          <span class="text-foreground truncate flex-1 mr-2">{{ item.name }}</span>
          <span :class="item.price === null ? 'text-destructive' : 'text-foreground font-medium'">
            {{ formatCurrency(item.price) }}
          </span>
        </div>
      </div>

      <!-- Subtotal -->
      <div
        v-if="profileCosts.length > 0 || analysisCosts.length > 0"
        class="border-t border-border pt-2 mt-2"
      >
        <div class="flex justify-between items-center font-semibold">
          <span class="text-foreground">Subtotal:</span>
          <span class="text-primary text-base">{{ formatCurrency(subtotal) }}</span>
        </div>
      </div>

      <!-- No items message -->
      <div v-if="profileCosts.length === 0 && analysisCosts.length === 0" class="text-muted-foreground italic">
        No tests selected
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.25rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}
</style>
