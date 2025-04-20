<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const FelLink = defineAsyncComponent(
  () => import("@/components/nav/FelLink.vue")
);

interface Props {
  label: string;
  value: string | number;
  link?: {
    name: string;
    query?: Record<string, any>;
  };
  variant?: 'default' | 'muted' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
});

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};

const variantClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary'
};
</script>

<template>
  <div class="flex items-center justify-between gap-4 py-1">
    <span
      class="font-medium"
      :class="[sizeClasses[size], variantClasses[variant]]"
    >
      {{ label }}
    </span>
    <div class="flex-1 text-right">
      <FelLink
        v-if="link"
        :name="String(value)"
        :routeName="link.name"
        :query="link.query"
        class="text-primary hover:text-primary/90 hover:underline"
      />
      <span
        v-else
        class="font-normal"
        :class="[sizeClasses[size], variantClasses[variant]]"
      >
        {{ value }}
      </span>
    </div>
  </div>
</template>
