<script setup lang="ts">
import type { GrindBoardType } from "@/types/gql";

const props = defineProps({
  board: {
    type: Object as PropType<GrindBoardType>,
    default: () => ({})
  }
})
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-4 shadow-sm">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-foreground">{{ board?.title?.toUpperCase() }}</h3>
      <div class="h-px bg-border" />
      <p class="text-sm text-muted-foreground">{{ board?.description || '---' }}</p>
    </div>
  </div>
</template>




