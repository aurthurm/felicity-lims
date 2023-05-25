<script setup lang="ts">
  import tabAssignSamples from './ShipmentAssign.vue';
  import tabShipmentSamples from './ShipmentSamples.vue';
  import tabManifest from './Manifest.vue';
  import tabLogs from '../../components/AuditLog.vue';

  import { ref, computed } from 'vue';
  import { useShipmentStore } from '../../../stores'

  let shipmentStore = useShipmentStore();

  let currentTab = ref('detail');

  const shipment = computed(() => shipmentStore.getShipment)
  
  const tabs = computed(() => {
    if(!["preperation", "empty"].includes(shipment.value?.state ?? "")) return ['detail', "manifest", 'logs']
    return ['detail', 'assign-samples', 'logs']
  })
</script>

<template>
  <div class="">
      <section class="col-span-12" >

        <!-- Sample and Case Data -->
        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <div>
          <tab-shipment-samples v-if="currentTab === 'detail'" />
          <tab-assign-samples v-if="currentTab === 'assign-samples'"/>
          <tab-manifest v-if="currentTab === 'manifest'"/>
          <tab-logs 
          v-if="currentTab === 'logs'"
          targetType="shipment"
          :targetId="shipment?.uid"
          />
        </div>

      </section>

  </div>

</template>