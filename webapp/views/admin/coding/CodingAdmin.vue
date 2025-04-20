<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const tabCodingStandard = defineAsyncComponent(
    () => import('./CodingStandard.vue')
  )

  const tabs = [
    {
      id: 'coding-standard',
      label: 'Coding Standard',
      component: tabCodingStandard
    }
  ]
 </script>

<template>
  <fel-tabs :tabs="tabs"></fel-tabs>
</template>
