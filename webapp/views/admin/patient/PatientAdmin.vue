<script setup lang="ts">
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
  <beak-tabs :tabs="tabs"></beak-tabs>
</template>
