<style lang="postcss">
  .scroll-section {
    height: 400px;
  }

  .tab-active {
    border-bottom: 2px solid rgb(194, 193, 193);
    color: rgb(37, 37, 37) !important;
  }

  .c-active {
    background-color: lightblue;
  }
</style>

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

        <tab-suppliers v-if="currentTab === 'suppliers'"/>
        <tab-manufacturers v-if="currentTab === 'manufacturers'" />

  </div>

</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import tabSuppliers from './Suppliers.vue'
  import tabManufacturers from './Manufacturers.vue'

  let currentTab = ref<string>('suppliers');
  const tabs: string[] = ['suppliers', 'manufacturers'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);
</script>
