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
  <beak-tabs :tabs="tabs" />
</template>
