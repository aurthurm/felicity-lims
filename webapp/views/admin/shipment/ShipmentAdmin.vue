<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabReferralLaboratory = defineAsyncComponent(
    () => import('./ReferralLaboratory.vue')
  )

  const tabs = [
    {
      id: 'referral-laboratories',
      label: 'Referral Laboratories',
      component: tabReferralLaboratory
    }
  ]
 </script>

<template>
  <beak-tabs :tabs="tabs"></beak-tabs>
</template>
