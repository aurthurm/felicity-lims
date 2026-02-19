<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const tabs = [
  {
    id: "overview",
    label: "Overview",
    component: defineAsyncComponent(() => import("./Overview.vue")),
    summary: "Operational totals and workflow health",
  },
  {
    id: "resource",
    label: "Resource",
    component: defineAsyncComponent(() => import("./Resource.vue")),
    summary: "Instrument and staff utilization",
  },
  {
    id: "laggard",
    label: "Laggard",
    component: defineAsyncComponent(() => import("./Laggard.vue")),
    summary: "Slowest items and bottlenecks",
  },
  {
    id: "peformance",
    label: "Performance",
    component: defineAsyncComponent(() => import("./Peformance.vue")),
    summary: "Time-to-complete process metrics",
  },
  {
    id: "tat",
    label: "TAT",
    component: defineAsyncComponent(() => import("./Tat.vue")),
    summary: "Turn-around-time tracking",
  },
  {
    id: "notices",
    label: "Notices",
    component: defineAsyncComponent(() => import("./Notice.vue")),
    summary: "Important laboratory communication",
  },
  {
    id: "line-listing",
    label: "Line Listing",
    component: defineAsyncComponent(() => import("./LineListing.vue")),
    summary: "Detailed operational listing",
  },
  {
    id: "inventory",
    label: "Inventory",
    component: defineAsyncComponent(() => import("./Inventory.vue")),
    summary: "Stock and consumption snapshots",
  },
];

const activeTabId = computed(() => String(route.query.tab || tabs[0].id));
const activeTab = computed(() => tabs.find((tab) => tab.id === activeTabId.value) || tabs[0]);

const jumpToTab = (tabId: string): void => {
  router.replace({
    query: {
      ...route.query,
      tab: tabId,
    },
  });
};
</script>

<template>
  <section class="space-y-4">
    <div
      class="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-4 md:p-6"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Operations Hub
          </p>
          <h1 class="text-2xl font-semibold text-foreground md:text-3xl">
            Laboratory Dashboard
          </h1>
          <p class="max-w-2xl text-sm text-muted-foreground">
            Central control surface for throughput, quality, utilization, and workflow movement.
          </p>
        </div>

        <div class="rounded-lg border border-border bg-card/80 px-4 py-3 shadow-sm">
          <p class="text-xs uppercase tracking-wide text-muted-foreground">Active Focus</p>
          <p class="text-lg font-semibold text-foreground">{{ activeTab.label }}</p>
          <p class="text-xs text-muted-foreground">{{ activeTab.summary }}</p>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="`hub-jump-${tab.id}`"
          type="button"
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="
            activeTabId === tab.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
          "
          @click="jumpToTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <beak-tabs :tabs="tabs" />
  </section>
</template>
