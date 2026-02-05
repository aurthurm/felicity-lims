<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card-header"
    :class="cn('flex flex-col space-y-1.5 p-4', props.class)"
  >
    <slot />
  </div>
</template>
