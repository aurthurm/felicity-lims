<script setup lang="ts">
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { useSampleStore } from "@/stores";

const tabResults = defineAsyncComponent(
  () => import("./Results.vue")
)
const tabManageAnalyses = defineAsyncComponent(
  () => import("./ManageAnalyses.vue")
)
const tabImpress = defineAsyncComponent(
  () => import("./Impress.vue")
)
const tabLogs = defineAsyncComponent(
  () => import("@/components/audit/FelAuditLog.vue")
)

const sampleStore = useSampleStore();
const currentTab = ref("analysis-results")
const tabs = computed(() => {
  const tabs = ["analysis-results", "manage-analyses", "logs", "impress-reports"];
  if (sampleStore.sample?.status === 'published') {
    const index = tabs.indexOf('manage-analyses');
    if (index !== -1) {
      tabs.splice(index, 1);
    }
  }
  return tabs;
})

let currentTabComponent = computed(() => "tab-" + currentTab);
</script>

<template>
  <section class="col-span-12">
    <nav class="bg-white shadow-md mt-2" v-motion-slide-left>
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
            { 'tab-active': currentTab === tab },
          ]"
          @click="currentTab = tab"
        >
          {{ tab }}
        </a>
      </div>
    </nav>

    <div>
      <tab-results v-if="currentTab === 'analysis-results'" />
      <tab-manage-analyses v-if="currentTab === 'manage-analyses'" @changeTab="(tab) => (currentTab = tab)" />
      <tab-logs
        v-if="currentTab === 'logs'"
        targetType="sample"
        :targetId="sampleStore.sample?.uid"
      />
      <tab-impress v-if="currentTab === 'impress-reports'" />
    </div>
  </section>
</template>
