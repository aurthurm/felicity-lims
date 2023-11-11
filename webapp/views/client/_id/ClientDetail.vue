<script setup lang="ts">
import { ref, computed } from "vue";
import { useClientStore } from "../../../stores";
import tabSamples from "../../components/SampleListing.vue";
import tabContacts from "./ContactTable.vue";
import tabLogs from "../../components/AuditLog.vue";

const clientStore = useClientStore();

let currentTab = ref("samples");
const tabs = ["samples", "contacts", "logs"];
let currentTabComponent = computed(() => "tab-" + currentTab.value);

let client = computed(() => clientStore.getClient);
</script>

<template>
  <section class="col-span-12">
    <nav class="bg-white shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a v-for="tab in tabs" :key="tab" :class="[
          'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
          { 'tab-active': currentTab === tab },
        ]" @click="currentTab = tab">
          {{ tab }}
        </a>
      </div>
    </nav>

    <div class="pt-4">
      <tab-samples v-if="currentTab === 'samples'" />
      <tab-contacts v-if="currentTab === 'contacts'" :clientUid="client?.uid" />
      <tab-logs v-if="currentTab === 'logs'" targetType="client" :targetId="client?.uid" />
    </div>
  </section>
</template>

<style lang="postcss"></style>
