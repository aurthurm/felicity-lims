<script setup lang="ts">
import { computed } from 'vue';
import { useStorageStore } from '@/stores/storage';

defineOptions({ name: 'ContainerColumnView' });

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
  <div class="max-h-[600px] overflow-y-auto rounded-lg bg-background p-4 shadow-sm">
    <div
      v-for="slotNum in (container?.slots ?? 0)"
      :key="slotNum"
      class="mb-2 grid w-full grid-cols-12 gap-x-4"
    >
      <span class="col-span-1 my-1 text-sm font-medium text-muted-foreground">{{ slotNum }}:</span>
      <div
        :class="[
          'col-span-11 rounded-lg p-2 transition-colors duration-200 cursor-pointer hover:bg-muted/50',
          slotSample(Number(slotNum)) === null ? 'bg-muted/30' : 'bg-emerald-500/20 hover:bg-emerald-500/30',
        ]"
      >
        <div class="text-sm font-medium">{{ slotSample(Number(slotNum))?.sampleId || 'Empty' }}</div>
      </div>
    </div>
  </div>
</template>
