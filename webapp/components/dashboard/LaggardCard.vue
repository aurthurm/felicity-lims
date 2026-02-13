<template>
  <div
    class="rounded-lg border border-border bg-card shadow-sm p-5 border-l-4 border-primary"
  >
    <div class="flex items-center justify-between gap-3 mb-2">
      <p class="text-sm text-muted-foreground">
        {{ title }}
      </p>
      <div
        v-if="tooltip"
        class="group relative inline-block"
      >
        <span class="cursor-help text-muted-foreground transition-colors hover:text-primary">
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
      {{ total }}
    </p>

    <div class="mt-3 space-y-3">
      <div>
        <div class="flex items-center justify-between gap-2 mb-1">
          <span
            class="text-sm font-medium"
            :class="hasData ? onTimePercentColorClass : 'text-muted-foreground'"
          >
            {{ onTimePercent }}% on-time
          </span>
          <span class="text-xs text-muted-foreground">
            {{ onTimeCount }} on-time / {{ delayedCount }} delayed
          </span>
        </div>
        <div class="h-2 w-full rounded-full bg-muted overflow-hidden flex">
          <div
            v-if="hasData"
            class="h-full rounded-l-full transition-all duration-300 bg-success"
            :style="{ width: `${onTimePercent}%` }"
          />
          <div
            class="h-full transition-all duration-300"
            :class="hasData ? 'rounded-r-full bg-destructive' : 'rounded-full bg-muted'"
            :style="{ width: hasData ? `${100 - onTimePercent}%` : '100%' }"
          />
        </div>
      </div>

      <div class="pt-2 border-t border-border">
        <p class="text-xs text-muted-foreground mb-2">
          {{ daysLabel }}
        </p>
        <div class="grid grid-cols-4 gap-2">
          <div class="rounded-md bg-muted/50 px-2 py-1.5 text-center">
            <p class="text-lg font-semibold text-foreground">
              {{ lessThanTen }}
            </p>
            <p class="text-xs text-muted-foreground">
              &lt;10
            </p>
          </div>
          <div class="rounded-md bg-muted/50 px-2 py-1.5 text-center">
            <p class="text-lg font-semibold text-foreground">
              {{ tenToTwenty }}
            </p>
            <p class="text-xs text-muted-foreground">
              10–20
            </p>
          </div>
          <div class="rounded-md bg-muted/50 px-2 py-1.5 text-center">
            <p class="text-lg font-semibold text-foreground">
              {{ twentyToThirty }}
            </p>
            <p class="text-xs text-muted-foreground">
              20–30
            </p>
          </div>
          <div class="rounded-md bg-muted/50 px-2 py-1.5 text-center">
            <p class="text-lg font-semibold text-foreground">
              {{ graterThanThirty }}
            </p>
            <p class="text-xs text-muted-foreground">
              &gt;30
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** Card title */
  title: string;
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip popover position: 'left' = extends right, 'right' = extends left (use for right-side cards) */
  tooltipPosition?: "left" | "right";
  /** Total count */
  total: number;
  /** On-time count (totalDelayed) */
  onTimeCount: number;
  /** Delayed count (totalNotDelayed) */
  delayedCount: number;
  /** Days breakdown */
  lessThanTen?: number;
  tenToTwenty?: number;
  twentyToThirty?: number;
  graterThanThirty?: number;
  /** Label for the days breakdown section */
  daysLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: undefined,
  tooltipPosition: "left",
  lessThanTen: 0,
  tenToTwenty: 0,
  twentyToThirty: 0,
  graterThanThirty: 0,
  daysLabel: "Days since created",
});

const hasData = computed(() => props.total > 0);

const onTimePercent = computed(() => {
  const total = props.onTimeCount + props.delayedCount;
  if (total === 0) return 0;
  return Math.round((props.onTimeCount / total) * 100);
});

const onTimePercentColorClass = computed(() => {
  const p = onTimePercent.value;
  if (p >= 80) return "text-success";
  if (p >= 50) return "text-warning";
  return "text-destructive";
});
</script>
