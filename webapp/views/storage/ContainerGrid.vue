<script setup lang="ts">
import { computed } from 'vue';
import { useStorageStore } from '@/stores/storage';

defineOptions({ name: 'ContainerGridView' });

const storageStore = useStorageStore();
const container = computed(() => storageStore.getStorageContainer);

function slotSample(slotIndex: number) {
  if (!container.value?.samples) return null;
  const idx = container.value.samples.findIndex((sample) => sample.storageSlotIndex === slotIndex);
  if (idx != null && idx > -1) return container.value.samples[idx];
  return null;
}
</script>

<template>
  <div v-if="container?.grid === false" class="rounded-lg bg-background p-4 shadow-sm">
    <p>The selected container does not support grid view</p>
  </div>

  <div v-else class="overflow-auto rounded-lg bg-background p-4 shadow-sm">
    <!-- Row-wise layout -->
    <template v-if="container?.rowWise">
      <div
        v-for="row in (container?.rows ?? 0)"
        :key="'row-' + row"
        :class="['mb-2 rounded-lg border border-border', 'grid grid-cols-' + (container?.cols ?? 0)]"
      >
        <div
          v-for="col in (container?.cols ?? 0)"
          :key="'col-' + col"
          :class="[
            'col-span-1 w-full border-r border-border p-2 text-foreground transition-colors duration-200 last:border-r-0 cursor-pointer hover:bg-muted/50',
            slotSample((row - 1) * (container?.cols ?? 0) + col) === null ? 'bg-muted/30' : 'bg-emerald-500/20 hover:bg-emerald-500/30',
          ]"
        >
          <div class="text-center text-sm font-medium">{{ (row - 1) * (container?.cols ?? 0) + col }}</div>
          <div class="mt-1 text-center text-xs text-muted-foreground">
            {{ slotSample((row - 1) * (container?.cols ?? 0) + col)?.sampleId }}
          </div>
        </div>
      </div>
    </template>

    <!-- Column-wise layout -->
    <template v-else>
      <div :class="['grid gap-4', 'grid-cols-' + (container?.cols ?? 0)]">
        <div v-for="col in (container?.cols ?? 0)" :key="'c-' + col" class="col-span-1 space-y-2">
          <div
            v-for="row in (container?.rows ?? 0)"
            :key="'r-' + row"
            :class="[
              'rounded-lg p-2 text-center transition-colors duration-200 cursor-pointer hover:bg-muted/50',
              slotSample((col - 1) * (container?.rows ?? 0) + row) === null ? 'bg-muted/30' : 'bg-emerald-500/20 hover:bg-emerald-500/30',
            ]"
          >
            <span class="text-sm font-medium">{{ (col - 1) * (container?.rows ?? 0) + row }}</span>
            <div class="mt-1 text-xs text-muted-foreground">
              {{ slotSample((col - 1) * (container?.rows ?? 0) + row)?.sampleId }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
