<template>
  <div
    role="button"
    tabindex="0"
    class="rounded-lg border border-border bg-card shadow-sm p-5 border-l-4 cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    :class="borderVariantClass"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="flex items-center justify-between gap-3 mb-2">
      <p class="text-sm text-muted-foreground">
        {{ title }}
      </p>
      <div
        v-if="tooltip"
        class="group relative inline-block"
        @click.stop
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
    <p class="text-2xl font-bold text-foreground">
      {{ processAverage }} days
    </p>
    <div class="mt-3">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span
          class="text-sm font-medium"
          :class="onTimePercentColorClass"
        >
          {{ onTimePercent }}% on-time
        </span>
      </div>
      <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="progressBarColorClass"
          :style="{ width: `${Math.min(100, Math.max(0, onTimePercent))}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineEmits<{
  click: [];
}>();

interface Props {
  /** Card title/label */
  title: string;
  /** Average days for the process */
  processAverage: number;
  /** On-time percentage (0-100) */
  onTimePercent: number;
  /** Whether this card is selected (drives the chart below) */
  selected?: boolean;
  /** Optional tooltip text */
  tooltip?: string;
  /** Tooltip popover position */
  tooltipPosition?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  tooltip: undefined,
  tooltipPosition: "left",
});

const borderVariantClass = computed(() =>
  props.selected ? "border-primary" : "border-foreground"
);
const hoverVariantClass = "hover:text-primary";

const onTimePercentColorClass = computed(() => {
  const p = props.onTimePercent;
  if (p >= 80) return "text-success";
  if (p >= 50) return "text-warning";
  return "text-destructive";
});

const progressBarColorClass = computed(() => {
  const p = props.onTimePercent;
  if (p >= 80) return "bg-success";
  if (p >= 50) return "bg-warning";
  return "bg-destructive";
});
</script>
