<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
defineOptions({ name: 'StorageView' })
  const Storage = defineAsyncComponent(
    () => import("./Storage")
  )
</script>

<template>
  <Storage />
</template>
