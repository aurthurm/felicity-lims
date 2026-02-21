<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const BillingSubscription = defineAsyncComponent(
  () => import('@/views/billing/BillingSubscription.vue')
);
</script>

<template>
  <BillingSubscription />
</template>
