<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card-content"
    :class="cn('p-4 pt-0', props.class)"
  >
    <slot />
  </div>
</template>
