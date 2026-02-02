<script setup lang="ts">
import { computed } from "vue"
import { cn } from "@/utils/cn"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const props = defineProps<{
  show: boolean
  contentWidth?: string
  side?: "left" | "right" | "top" | "bottom"
  class?: string
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
    <SheetContent :side="side ?? 'right'" :class="contentClasses">
      <SheetHeader>
        <SheetTitle>
          <slot name="header">Drawer Title</slot>
        </SheetTitle>
      </SheetHeader>

      <div>
        <slot name="body">Drawer Body</slot>
      </div>

      <SheetFooter>
        <slot name="footer" />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
