<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
defineOptions({ name: 'InventoryView' })
  const Inventory = defineAsyncComponent(
    () => import("./Inventory")
  )
</script>

<template>
  <Inventory />
</template>
