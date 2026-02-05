<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground rounded-xl border shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
