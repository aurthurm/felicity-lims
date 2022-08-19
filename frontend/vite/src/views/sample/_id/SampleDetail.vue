<script setup lang="ts">
import tabResults from "./Results.vue";
import tabLogs from "../../components/AuditLog.vue";
import { ref, computed, reactive } from "vue";
import { useSampleStore } from "../../../stores";

const sampleStore = useSampleStore();

const state = reactive({
  currentTab: ref("analysis-results"),
  tabs: ["analysis-results", "logs"],
  sample: computed(() => sampleStore.getSample),
});

let currentTabComponent = computed(() => "tab-" + state.currentTab);
</script>

<template>
  <section class="col-span-12">
    <nav class="bg-white px-6 pt-2 shadow-md mt-2" v-motion-slide-left>
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in state.tabs"
          :key="tab"
          :class="[
            'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
            { 'tab-active': state.currentTab === tab },
          ]"
          @click="state.currentTab = tab"
          href="#"
        >
          {{ tab }}
        </a>
      </div>
    </nav>

    <div>
      <tab-results v-if="state.currentTab === 'analysis-results'" />
      <tab-logs
        v-if="state.currentTab === 'logs'"
        targetType="sample"
        :targetId="state.sample?.uid"
      />
    </div>
  </section>
</template>
