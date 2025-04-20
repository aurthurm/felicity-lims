<script setup lang="ts">
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
  <fel-tabs :tabs="tabs" />
</template>
