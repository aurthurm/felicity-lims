<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabLaboratory = defineAsyncComponent(
    () => import('./Laboratory.vue')
  )
  const tabDepartments = defineAsyncComponent(
    () => import('./Departments.vue')
  )

  let currentTab = ref<string>('laboratory');
  const tabs: string[]= ['laboratory', 'departments'];
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

        <tab-laboratory v-if="currentTab === 'laboratory'"/>
        <tab-departments v-if="currentTab === 'departments'" />

  </div>
</template>
