<template>
    <fel-heading title="Billing" />
    <fel-tabs :tabs="tabs" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const BillingOverview = defineAsyncComponent(() => import('./BillingOverview.vue'));
const BillingListing = defineAsyncComponent(() => import('./BillingListing.vue'));

const tabs = [
    {
        id: 'overview',
        label: 'Overview',
        component: BillingOverview
    },
    {
        id: 'bills',
        label: 'Bills',
        component: BillingListing
    }
]
</script>