<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    data-slot="sheet-footer"
    :class="cn('mt-auto flex flex-row flex-wrap justify-end gap-2 p-4', props.class)"
  >
    <slot />
  </div>
</template>
