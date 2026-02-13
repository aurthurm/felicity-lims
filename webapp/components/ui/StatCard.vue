<template>
  <div
    class="rounded-lg border border-border bg-card shadow-sm p-4 border-l-4"
    :class="borderVariantClass"
  >
    <div class="flex items-center justify-between gap-3 mb-2">
      <p class="text-sm text-muted-foreground">
        {{ title }}
      </p>
      <div
        v-if="tooltip"
        class="group relative inline-block"
      >
        <span
          class="cursor-help text-muted-foreground transition-colors"
          :class="hoverVariantClass"
        >
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <div
          class="hidden group-hover:block absolute z-10 bottom-full mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border"
          :class="tooltipPosition === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'"
        >
          {{ tooltip }}
        </div>
      </div>
    </div>
    <p
      class="text-2xl font-bold"
      :class="[valueColorClass]"
    >
      <slot name="value">
        {{ value }}
      </slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** Card title/label */
  title: string;
  /** Main value to display (use slot for custom content) */
  value?: string;
  /** Visual variant for border and accents */
  variant?: 'primary' | 'success' | 'warning' | 'accent' | 'destructive' | 'muted' | 'foreground';
  /** Optional tooltip text (shows info icon when provided) */
  tooltip?: string;
  /** Tooltip popover position */
  tooltipPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  variant: 'primary',
  tooltip: undefined,
  tooltipPosition: 'left'
});

const borderVariantClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'border-primary',
    success: 'border-success',
    warning: 'border-warning',
    accent: 'border-accent',
    destructive: 'border-destructive',
    muted: 'border-muted',
    foreground: 'border-border'
  };
  return map[props.variant] ?? 'border-primary';
});

const hoverVariantClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'hover:text-primary',
    success: 'hover:text-success',
    warning: 'hover:text-warning',
    accent: 'hover:text-accent',
    destructive: 'hover:text-destructive',
    muted: 'hover:text-muted',
    foreground: 'hover:text-foreground'
  };
  return map[props.variant] ?? 'hover:text-primary';
});

const valueColorClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
    destructive: 'text-destructive',
    muted: 'text-muted',
    foreground: 'text-foreground'
  };
  return map[props.variant] ?? 'text-foreground';
});
</script>
