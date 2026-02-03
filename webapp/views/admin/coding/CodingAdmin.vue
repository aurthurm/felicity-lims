<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
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
  <TabsNav :tabs="tabs"></TabsNav>
</template>
