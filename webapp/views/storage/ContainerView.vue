<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStorageStore } from '@/stores/storage';
import ContainerColumn from './ContainerColumn.vue';
import ContainerGrid from './ContainerGrid.vue';

defineOptions({ name: 'ContainerView' });

const storageStore = useStorageStore();
const currentTab = ref('column-view');
const storageContainer = computed(() => storageStore.getStorageContainer);

const tabs = computed(() => {
  const cont = storageStore.getStorageContainer;
  return cont?.grid ? ['column-view', 'grid-view'] : ['column-view'];
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1 space-y-4">
        <div class="flex items-center">
          <span class="w-52 text-md font-bold text-foreground">Name:</span>
          <span class="text-md text-foreground">{{ storageContainer?.name }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-52 text-md font-bold text-foreground">Layout:</span>
          <span class="text-md text-foreground">{{ storageContainer?.grid ? 'grid' : 'column' }}</span>
          <span
            v-if="storageContainer?.grid"
            class="ml-2 rounded-md bg-muted px-2 py-1 text-md italic text-foreground"
          >
            {{ storageContainer?.rowWise ? 'by-row' : 'by-column' }}
          </span>
        </div>
      </div>
      <div class="col-span-1 space-y-4">
        <div class="flex items-center">
          <span class="w-52 text-md font-bold text-foreground">Slots:</span>
          <span class="text-md text-foreground">{{ storageContainer?.slots }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-52 text-md font-bold text-foreground">Empty Slots:</span>
          <span class="text-md text-foreground">
            {{ (storageContainer?.slots ?? 0) - (storageContainer?.samples?.length ?? 0) }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="rounded-lg border bg-background shadow-sm" role="tablist">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            role="tab"
            :aria-selected="currentTab === tab ? 'true' : 'false'"
            :aria-controls="`${tab}-panel`"
            :class="[
              'flex-1 px-4 py-3 text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              currentTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ]"
            @click="currentTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        <div class="mt-4" role="tabpanel" :id="`${currentTab}-panel`">
          <ContainerColumn v-if="currentTab === 'column-view'" />
          <ContainerGrid v-else-if="currentTab === 'grid-view'" />
        </div>
      </div>
    </div>
  </div>
</template>
