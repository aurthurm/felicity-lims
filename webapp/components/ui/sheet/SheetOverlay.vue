<script setup lang="ts">
import type { DialogOverlayProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { DialogOverlay } from "reka-ui"
import { cn } from '@/utils/cn'

const props = withDefaults(
  defineProps<DialogOverlayProps & { class?: HTMLAttributes["class"]; side?: "top" | "right" | "bottom" | "left" }>(),
  { side: "right" }
)

const delegatedProps = reactiveOmit(props, "class", "side")

const overlayStyle = props.side === "right" ? { right: "var(--right-sidebar-width, 3rem)" } : undefined
</script>

<template>
  <DialogOverlay
    data-slot="sheet-overlay"
    :class="cn('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80', props.class)"
    :style="overlayStyle"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogOverlay>
</template>
