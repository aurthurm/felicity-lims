<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const SuppliersListing = defineAsyncComponent(
        () => import('./SuppliersListing.vue')
  )
  const Manufacturers = defineAsyncComponent(
        () => import('./Manufacturers.vue')
  )

  const tabs = [
    { 
      id:"suppliers", 
      label: 'suppliers', 
      component: SuppliersListing
    },
    { 
      id:"manufacturers", 
      label: 'manufacturers', 
      component: Manufacturers
    },  
  ];
</script>

<template>
  <fel-tabs :tabs="tabs" />
</template>

