
<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  const Inventory = defineAsyncComponent(
    () => import('./Inventory.vue')
)
</script>

<template>
  <Inventory />
</template>
