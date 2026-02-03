<script setup lang="ts">
import { computed } from "vue"
import { cn } from "@/utils/cn"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const props = defineProps<{
  show: boolean
  contentWidth?: string
  side?: "left" | "right" | "top" | "bottom"
  class?: string
  /** When true, sheet renders in place so a sibling (e.g. right sidebar) can stack above it */
  disablePortal?: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const contentClasses = computed(() =>
  cn(props.contentWidth, props.class)
)
</script>

<template>
  <Sheet :open="show" @update:open="(open) => !open && emit('close')">
    <SheetContent :side="side ?? 'right'" :class="contentClasses" :disable-portal="disablePortal">
      <SheetHeader>
        <SheetTitle>
          <slot name="header">Drawer Title</slot>
        </SheetTitle>
        <SheetDescription class="sr-only">
          <slot name="description">Drawer content</slot>
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 min-h-0 overflow-y-auto p-4">
        <slot name="body">Drawer Body</slot>
      </div>

      <SheetFooter v-if="$slots.footer">
        <slot name="footer" />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
