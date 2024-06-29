<script setup lang="ts">
  const props = defineProps({
    board: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<template>
  <div class="bg-white shadow rounded-sm px-3 pt-3 pb-5 border border-white">
    <div class="">
      <h3 class="h2 font-bold text-gray-600">{{ board?.title?.toUpperCase() }}</h3>
      <hr class="my-2">
      <p class="text-gray-400 font-semibold font-sans tracking-wide text-sm">{{ board?.description || '---' }}</p>
    </div>
  </div>
</template>




