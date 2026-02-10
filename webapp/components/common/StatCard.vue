<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const props = withDefaults(
  defineProps<{
    /** Label shown above the value (e.g. "Total Charged") */
    label: string;
    /** Optional tooltip text; when set, an info icon is shown */
    tooltip?: string;
    /** Tailwind class for the left border accent (e.g. border-l-primary, border-l-emerald-500) */
    borderClass?: string;
    /** Tailwind class for the value text (e.g. text-foreground, text-emerald-600) */
    valueClass?: string;
    /** Extra class for the root card */
    class?: HTMLAttributes["class"];
  }>(),
  {
    borderClass: "border-l-primary",
    valueClass: "text-foreground",
  }
);
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground rounded-xl border shadow-sm border-l-4 p-4',
        props.borderClass,
        props.class
      )
    "
  >
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm font-medium text-muted-foreground">{{ label }}</span>
      <Tooltip v-if="tooltip">
        <TooltipTrigger as-child>
          <button
            type="button"
            class="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Info"
          >
            <svg class="size-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" class="max-w-[14rem]">
          {{ tooltip }}
        </TooltipContent>
      </Tooltip>
    </div>
    <p :class="['mt-1 text-2xl font-bold tabular-nums', valueClass]">
      <slot />
    </p>
  </div>
</template>
