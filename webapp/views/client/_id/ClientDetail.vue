<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import { useClientStore } from "@/stores/client";

// Lazy load components
const tabSamples = defineAsyncComponent(
    () => import('@/components/sample/FelSampleListing.vue')
)
const tabContacts = defineAsyncComponent(
    () => import('./ContactTable.vue')
)
const tabLogs = defineAsyncComponent(
    () => import('@/components/audit/FelAuditLog.vue')
)

// Initialize store
const clientStore = useClientStore();

// Tab state
const currentTab = ref("samples");
const tabs = ["samples", "contacts", "logs"] as const;
type TabType = typeof tabs[number];

// Computed properties
const currentTabComponent = computed(() => "tab-" + currentTab.value);
const client = computed(() => clientStore.getClient);
</script>

<template>
  <section class="col-span-12">
    <nav class="bg-background shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a v-for="tab in tabs" :key="tab" :class="[
          'tab no-underline px-4 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:bg-primary hover:text-muted-foreground',
          { 'tab-active': currentTab === tab },
        ]" @click="currentTab = tab">
          {{ tab }}
        </a>
      </div>
    </nav>

    <div class="pt-4">
      <tab-samples v-if="currentTab === 'samples'" />
      <tab-contacts v-if="currentTab === 'contacts'" :clientUid="client?.uid" />
      <tab-logs v-if="currentTab === 'logs'" targetType="client" :targetUid="client?.uid" />
    </div>
  </section>
</template>

<style lang="postcss"></style>
