<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
import { ref, computed, defineAsyncComponent } from 'vue';
const tabPersonIdentification = defineAsyncComponent(
  () => import('./PersonIdentification.vue')
)

const tabs  = [
  {
    id: 'person-identification',
    label: 'Person Identification',
    component: tabPersonIdentification
  }
]
</script>

<template>
  <TabsNav :tabs="tabs"></TabsNav>
</template>
