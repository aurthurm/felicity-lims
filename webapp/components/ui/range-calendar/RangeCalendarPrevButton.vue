<script lang="ts" setup>
import type { RangeCalendarPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ChevronLeft } from "lucide-vue-next"
import { RangeCalendarPrev, useForwardProps } from "reka-ui"
import { cn } from '@/utils/cn'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<RangeCalendarPrevProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarPrev
    data-slot="range-calendar-prev-button"
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'absolute left-1 border-0 shadow-none',
      'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-transparent',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronLeft class="size-4" />
    </slot>
  </RangeCalendarPrev>
</template>
