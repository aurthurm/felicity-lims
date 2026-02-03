<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
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
  <TabsNav :tabs="tabs" />
</template>

