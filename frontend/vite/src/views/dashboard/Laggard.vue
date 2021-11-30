<template>
  <h1 class="text-xl text-gray-700 font-semibold">Sample Back Log</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">23%</span>
      <span class="font-semibold text-gray-400 text-l">Roche</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">0.2%</span>
      <span class="font-semibold text-gray-400 text-l">Abbott</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">78%</span>
      <span class="font-semibold text-gray-400 text-l">Panther</span>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: "tab-laggards",
  setup() {

    return { 
    };
  },
});
</script>