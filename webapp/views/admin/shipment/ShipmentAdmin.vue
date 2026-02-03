<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
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
  <TabsNav :tabs="tabs"></TabsNav>
</template>
