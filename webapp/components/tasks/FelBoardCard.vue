<script setup lang="ts">
  const props = defineProps({
    board: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<template>
  <div class="bg-background shadow rounded-sm px-3 pt-3 pb-5 border border-foreground">
    <div class="">
      <h3 class="h2 font-bold text-foreground">{{ board?.title?.toUpperCase() }}</h3>
      <hr class="my-2">
      <p class="text-muted-foreground font-semibold font-sans tracking-wide text-sm">{{ board?.description || '---' }}</p>
    </div>
  </div>
</template>




