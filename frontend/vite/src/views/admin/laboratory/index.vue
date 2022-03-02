<template>
  <div class="mt-4">

        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-laboratory v-if="currentTab === 'laboratory'"/>
        <tab-departments v-if="currentTab === 'departments'" />

  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  import tabLaboratory from './Laboratory.vue'
  import tabDepartments from './Departments.vue'


  let currentTab = ref<string>('laboratory');
  const tabs: string[]= ['laboratory', 'departments'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);
</script>
