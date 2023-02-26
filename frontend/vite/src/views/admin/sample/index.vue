<script setup lang="ts">
  import { ref, computed } from 'vue';

  import tabSampleTypes from './SampleTypes.vue'
  import tabContainerTypes from './ContainerTypes.vue'


  let currentTab = ref<string>('sample-types');
  const tabs: string[] = ['sample-types']; //  'container-types'
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);

 </script>

<template>
  <div class="mt-4">

        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-100 hover:text-sky-800',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-sample-types v-if="currentTab === 'sample-types'"/>
        <tab-container-types v-if="currentTab === 'container-types'" />

  </div>

</template>
