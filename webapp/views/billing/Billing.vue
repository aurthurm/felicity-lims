<template>
    <beak-heading title="Billing" />
    <beak-tabs :tabs="tabs" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const BillingOverview = defineAsyncComponent(() => import('./BillingOverview.vue'));
const BillingListing = defineAsyncComponent(() => import('./BillingListing.vue'));
const BillingSubscription = defineAsyncComponent(() => import('./BillingSubscription.vue'));

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
    },
    {
        id: 'subscription',
        label: 'Subscription',
        component: BillingSubscription
    }
]
</script>
