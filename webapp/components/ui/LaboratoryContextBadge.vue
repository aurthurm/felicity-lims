<script setup lang="ts">
import { computed } from "vue";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";

interface Props {
  showCode?: boolean;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

const props = withDefaults(defineProps<Props>(), {
  showCode: true,
  showDot: true,
  size: 'md',
  variant: 'default',
});

const contextStore = useLaboratoryContextStore();

const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
const hasMultipleLabs = computed(() => contextStore.hasMultipleLaboratories);
const isContextSwitching = computed(() => contextStore.context.contextSwitching);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-1 text-xs';
    case 'lg':
      return 'px-4 py-2 text-base';
    default:
      return 'px-3 py-1.5 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'border border-border bg-transparent text-foreground';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-primary/10 text-primary border border-primary/20';
  }
});

const dotColor = computed(() => {
  if (!currentLaboratory.value) return 'bg-gray-400';
  if (isContextSwitching.value) return 'bg-yellow-500';
  return 'bg-green-500';
});
</script>

<template>
  <div 
    v-if="currentLaboratory"
    :class="[
      'inline-flex items-center space-x-2 rounded-full font-medium transition-all duration-200',
      sizeClasses,
      variantClasses
    ]"
    :title="`Current Laboratory: ${currentLaboratory.name} (${currentLaboratory.code})`"
  >
    <!-- Status Dot -->
    <div 
      v-if="showDot"
      :class="[
        'w-2 h-2 rounded-full transition-all duration-200',
        dotColor,
        isContextSwitching ? 'animate-pulse' : ''
      ]"
    ></div>

    <!-- Laboratory Code/Name -->
    <span v-if="showCode">{{ currentLaboratory.code }}</span>
    <span v-else class="truncate max-w-32">{{ currentLaboratory.name }}</span>

    <!-- Multi-lab indicator -->
    <div 
      v-if="hasMultipleLabs && !isContextSwitching"
      class="w-1 h-1 rounded-full bg-current opacity-60"
      title="Multiple laboratories available"
    ></div>

    <!-- Loading indicator -->
    <i 
      v-if="isContextSwitching"
      class="fas fa-spinner fa-spin text-xs opacity-75"
    ></i>
  </div>

  <!-- No Laboratory -->
  <div 
    v-else
    :class="[
      'inline-flex items-center space-x-2 rounded-full font-medium bg-muted text-muted-foreground',
      sizeClasses
    ]"
    title="No laboratory context"
  >
    <div class="w-2 h-2 rounded-full bg-gray-400"></div>
    <span>No Lab</span>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>