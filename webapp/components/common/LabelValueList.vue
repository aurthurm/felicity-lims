<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

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
</script>

<template>
  <div class="grid gap-4" :class="`grid-cols-${columns}`">
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
