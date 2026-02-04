<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { PanelRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    icon?: string
    open: boolean
    /** When true, panel fills its parent (e.g. fixed wrapper); no width transition */
    fillParent?: boolean
  }>(),
  { fillParent: false }
)

const emit = defineEmits<{ close: [] }>()

const panelStyle = computed(() => {
  if (props.fillParent) {
    return {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: '100%',
      boxSizing: 'border-box',
    }
  }
  const width = 'var(--right-sidebar-panel-width, 320px)'
  return props.open
    ? { width, minWidth: width, maxWidth: width }
    : { width: '0', minWidth: '0', maxWidth: '0' }
})
</script>

<template>
  <div
    class="right-sidebar-panel bg-background border-sidebar-border flex flex-col border-l overflow-hidden shrink-0"
    :class="[fillParent ? 'h-full shrink-0' : 'shrink-0 transition-[width] duration-200 ease-linear']"
    :style="panelStyle"
    role="region"
    :aria-label="open ? `${title} panel` : undefined"
  >
    <template v-if="open">
      <header class="flex h-10 shrink-0 items-center justify-between gap-1.5 border-b border-border px-3 py-2 min-w-0">
        <div class="flex items-center gap-2 min-w-0">
          <div
            v-if="icon"
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10"
          >
            <font-awesome-icon :icon="icon" class="size-3.5 text-primary" aria-hidden="true" />
          </div>
          <h2 class="text-sm font-semibold tracking-tight text-foreground truncate min-w-0">
            {{ title }}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7 shrink-0"
          aria-label="Close"
          @click="emit('close')"
        >
          <PanelRight class="size-3.5" />
        </Button>
      </header>
      <div class="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden w-full">
        <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 w-full min-w-0 max-w-full">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="flex shrink-0 border-t border-border p-3">
          <slot name="footer" />
        </footer>
      </div>
    </template>
  </div>
</template>
