<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
  import { ref, computed, defineAsyncComponent } from 'vue';
  const Voucher = defineAsyncComponent(
    () => import('./Voucher.vue')
  )

  const tabs = [
    {
      id: 'vouchers',
      label: 'Vouchers',
      component: Voucher
    }
  ]
</script>


<template>
  <TabsNav :tabs="tabs" />
</template>




