
<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  const Inventory = defineAsyncComponent(
    () => import('./Inventory')
)
</script>

<template>
  <Inventory />
</template>
