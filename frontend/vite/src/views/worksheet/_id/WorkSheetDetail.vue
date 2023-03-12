<script setup lang="ts">
  import tabAssignSamples from './WorkSheetAssign.vue';
  import tabWorksheetResults from './WorkSheetResults.vue';
  import tabLogs from '../../components/AuditLog.vue';

  import { ref, computed } from 'vue';
  import { useWorksheetStore } from '../../../stores'

  let worksheetStore = useWorksheetStore();

  let currentTab = ref('detail');
  const tabs = ['detail', 'assign-samples', 'logs'];

  const worksheet = computed(() => worksheetStore.getWorkSheet)
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
          <tab-worksheet-results v-if="currentTab === 'detail'" />
          <tab-assign-samples v-if="currentTab === 'assign-samples'"/>
          <tab-logs 
          v-if="currentTab === 'logs'"
          targetType="worksheet"
          :targetId="worksheet?.uid"
          />
        </div>

      </section>

  </div>

</template>