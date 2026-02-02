<script setup lang="ts">
import { computed } from "vue"
import { cn } from "@/utils/cn"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const props = defineProps<{
  contentWidth?: string
  title?: string
  class?: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "after-leave"): void
}>()

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
        <slot name="header">
          <DialogTitle v-if="title">{{ title }}</DialogTitle>
        </slot>
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
