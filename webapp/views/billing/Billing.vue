<template>
    <PageHeading title="Billing" />
    <TabsNav :tabs="tabs" />
</template>

<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
import { defineAsyncComponent } from 'vue';
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'BillingView' })
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