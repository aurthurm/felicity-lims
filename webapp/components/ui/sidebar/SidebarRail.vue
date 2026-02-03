<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { PanelLeft } from "lucide-vue-next"
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { toggleSidebar, state } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="rail"
    data-slot="sidebar-rail"
    variant="ghost"
    size="icon"
    aria-label="Toggle Sidebar"
    :tabindex="-1"
    title="Toggle Sidebar"
    :class="cn(
      'absolute top-4 z-20 h-8 w-8 -translate-x-1/2 transition-all ease-linear sm:flex',
      'group-data-[side=left]:-right-4 group-data-[side=right]:left-0 group-data-[side=right]:translate-x-1/2',
      'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
      'bg-sidebar-border/50 hover:bg-sidebar-accent hidden sm:flex',
      props.class,
    )"
    @click="toggleSidebar"
  >
    <slot>
      <PanelLeft
        :class="[
          'h-4 w-4 shrink-0 text-sidebar-foreground/70 transition-transform',
          state === 'collapsed' ? 'rotate-180' : '',
        ]"
      />
    </slot>
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
