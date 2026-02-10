<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

const LabelValue = defineAsyncComponent(
  () => import("@/components/common/LabelValue.vue")
);

interface LabelValueItem {
  label: string;
  value: string | number;
  link?: {
    name: string;
    query?: Record<string, any>;
  };
}

interface Props {
  items: LabelValueItem[];
  variant?: 'default' | 'muted' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  columns?: 1 | 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  columns: 3
});

const gridColsClass = computed(() => {
  switch (props.columns) {
    case 1: return 'grid-cols-1';
    case 2: return 'grid-cols-2';
    case 3: return 'grid-cols-3';
    case 4: return 'grid-cols-4';
    default: return 'grid-cols-3';
  }
});
</script>

<template>
  <div class="grid gap-4" :class="gridColsClass">
    <LabelValue
      v-for="item in items"
      :key="item.label"
      :label="item.label"
      :value="item.value"
      :link="item?.link"
      :variant="variant"
      :size="size"
    />
  </div>
</template>
