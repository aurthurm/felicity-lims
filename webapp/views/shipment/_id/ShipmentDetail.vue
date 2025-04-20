<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useShipmentStore } from '@/stores/shipment'

  const tabAssignSamples = defineAsyncComponent(
    () => import('./ShipmentAssign.vue')
  )
  const tabShipmentSamples = defineAsyncComponent(
    () => import('./ShipmentSamples.vue')
  )
  const tabManifest = defineAsyncComponent(
    () => import('./Manifest.vue')
  )
  const tabLogs = defineAsyncComponent(
    () => import('@/components/audit/FelAuditLog.vue')
  )

  let shipmentStore = useShipmentStore();

  let currentTab = ref('detail');

  const shipment = computed(() => shipmentStore.getShipment)
  
  const tabs = computed(() => {
    if(!["preperation", "empty"].includes(shipment.value?.state ?? "")) return ['detail', "manifest", 'logs']
    return ['detail', 'assign-samples', 'logs']
  })
</script>

<template>
  <div class="space-y-6">
    <section class="col-span-12">
      <!-- Sample and Case Data -->
      <nav class="bg-background rounded-lg shadow-sm border border-border">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
              currentTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="currentTab = tab"
            :aria-current="currentTab === tab ? 'page' : undefined"
          >
            {{ tab }}
          </button>
        </div>
      </nav>

      <div class="mt-6">
        <tab-shipment-samples v-if="currentTab === 'detail'" />
        <tab-assign-samples v-if="currentTab === 'assign-samples'"/>
        <tab-manifest v-if="currentTab === 'manifest'"/>
        <tab-logs 
          v-if="currentTab === 'logs'"
          targetType="shipment"
          :targetUid="shipment?.uid"
        />
      </div>
    </section>
  </div>
</template>