<script setup lang="ts">
import { computed, useSlots } from "vue"
import { cn } from "@/utils/cn"
import { VisuallyHidden } from "reka-ui"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const props = defineProps<{
  contentWidth?: string
  title?: string
  description?: string
  class?: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "after-leave"): void
}>()

const slots = useSlots()

const contentClasses = computed(() =>
  cn("w-full max-w-2xl", props.contentWidth, props.class)
)

const handleOpenChange = (open: boolean) => {
  if (!open) {
    emit("close")
    emit("after-leave")
  }
}
</script>

<template>
  <Dialog :open="true" @update:open="handleOpenChange">
    <DialogContent :class="contentClasses">
      <DialogHeader>
        <!-- When title prop is provided, use DialogTitle properly -->
        <DialogTitle v-if="title">{{ title }}</DialogTitle>
        <!-- When header slot is used, render slot content but include visually hidden DialogTitle for a11y -->
        <template v-else-if="slots.header">
          <VisuallyHidden as-child>
            <DialogTitle>Dialog</DialogTitle>
          </VisuallyHidden>
          <slot name="header" />
        </template>
        <!-- Fallback: visually hidden DialogTitle -->
        <VisuallyHidden v-else as-child>
          <DialogTitle>Dialog</DialogTitle>
        </VisuallyHidden>
        
        <!-- Description handling -->
        <DialogDescription v-if="description">{{ description }}</DialogDescription>
        <VisuallyHidden v-else as-child>
          <DialogDescription>Dialog content</DialogDescription>
        </VisuallyHidden>
      </DialogHeader>

      <div>
        <slot name="body">
          <slot />
        </slot>
      </div>

      <DialogFooter>
        <slot name="footer">
          <Button variant="secondary" @click="emit('close')">Cancel</Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
