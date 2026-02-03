<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
import { computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router"

// Lazy load components
const tabSamples = defineAsyncComponent(
    () => import('@/components/sample/SampleListing.vue')
)
const tabContacts = defineAsyncComponent(
    () => import('./ContactTable.vue')
)
const tabLogs = defineAsyncComponent(
    () => import('@/components/audit/AuditLog.vue')
)
const tabBills = defineAsyncComponent(
    () => import("./ClientBill.vue")
)

const route = useRoute()

// Computed properties
const clientUid = computed(() => route.query?.clientUid);

// Tab state
const tabs = [
  {
    id: "samples",
    label: "Samples",
    component: tabSamples,
    props: { clientUid: clientUid.value }
  },
  {
    id: "contacts",
    label: "Contacts",
    component: tabContacts,
    props: { clientUid: clientUid.value }
  },
  {
    id: "bills",
    label: "Bills",
    component: tabBills,
    props: { clientUid: clientUid.value }
  },
  {
    id: "logs",
    label: "Logs",
    component: tabLogs,
    props: { targetType: "client", targetUid: clientUid.value }
  }
];

</script>

<template>
  <TabsNav :tabs="tabs" initial-tab="samples" />
</template>

<style lang="postcss"></style>
