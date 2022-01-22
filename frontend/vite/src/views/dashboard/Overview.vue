<template>

  <h1 class="text-xl text-gray-700 font-semibold">Analyses Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div v-for="analyte in state.overViewStats?.value.analyses" :key="analyte.group"
    class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">{{ analyte.count }}</span>
      <span class="font-semibold text-gray-400 text-l">{{ analyte.group }}</span>
    </div>
  </div>
  
  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Sample Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div v-for="sample in state.overViewStats?.value.samples" :key="sample.group"
    class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">{{ sample.count }}</span>
      <span class="font-semibold text-gray-400 text-l">{{ sample.group }}</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">WorkSheet Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div v-for="worksheet in state.overViewStats?.value.worksheets" :key="worksheet.group"
    class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">{{ worksheet.count }}</span>
      <span class="font-semibold text-gray-400 text-l">{{ worksheet.group }}</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Other Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">cancelled samples</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">rejected samples</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">invalidated samples</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">retested analytes</span>
    </div>
  </div>


</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import useDashBoardComposable from '../../modules/dashboard';

  const { state, getOverViewStats } = useDashBoardComposable()
  onMounted(async () => getOverViewStats())
  
</script>