<script setup lang="ts">
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
  <beak-tabs :tabs="tabs" />
</template>




