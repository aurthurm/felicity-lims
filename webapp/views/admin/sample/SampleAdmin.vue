<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
  import { defineAsyncComponent } from 'vue';
  const tabSampleTypes = defineAsyncComponent(
    () => import('./SampleTypes.vue')
  )

  const tabs =[
    {
      id: 'sample-types',
      label: 'Sample Types',
      component: tabSampleTypes,
    }
  ]
 </script>

<template>
  <TabsNav :tabs="tabs" />
</template>
