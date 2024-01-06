<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  const Storage = defineAsyncComponent(
    () => import("./Storage")
  )
</script>

<template>
  <Storage />
</template>
