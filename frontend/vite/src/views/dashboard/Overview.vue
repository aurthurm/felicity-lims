<template>

  <h1 class="text-xl text-gray-700 font-semibold">Analyses Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">127</span>
      <span class="font-semibold text-gray-400 text-l">due</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">received</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">resulted</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">approved</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">published</span>
    </div>
  </div>
  
  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Sample Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">127</span>
      <span class="font-semibold text-gray-400 text-l">due</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">received</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">resulted</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">approved</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">published</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">WorkSheet Status</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">127</span>
      <span class="font-semibold text-gray-400 text-l">open</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">resulted</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">1345</span>
      <span class="font-semibold text-gray-400 text-l">approved</span>
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

<script lang="ts">
import { defineComponent} from 'vue'
export default defineComponent({
  name: "tab-volume",
  setup() {

    //
    return { 
    };
  },
});
</script>