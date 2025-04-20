<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const InstrumentTypes = defineAsyncComponent(
    () => import('./InstrumentTypes.vue')
  )
  const LaboratoryInstruments = defineAsyncComponent(
    () => import('./LaboratoryInstruments.vue')
  )
  const Instruments = defineAsyncComponent(
    () => import('./Instruments.vue')
  )
  const Methods = defineAsyncComponent(
    () => import('./Methods.vue')
  )
  const Units = defineAsyncComponent(
    () => import('./Units.vue')
  )

const tabs = [
    { 
      id:"insttypes", 
      label: 'Instrument Types', 
      component: InstrumentTypes
    },
    { 
      id:"linstruments", 
      label: 'Laboratory Instruments', 
      component: LaboratoryInstruments
    },
    { 
      id:"instruments", 
      label: 'Instruments', 
      component: Instruments
    },
    { 
      id:"methods", 
      label: 'Methods', 
      component: Methods
    },
    { 
      id:"units", 
      label: 'Units', 
      component: Units
    },  
  ];
</script>

<template>
  <fel-tabs :tabs="tabs" />
</template>


