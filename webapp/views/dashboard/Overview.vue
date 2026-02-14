<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
import { useDashBoardStore } from "@/stores/dashboard";
import StatCard from "@/components/ui/StatCard.vue";

// Initialize store
const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

// Load initial data
onMounted(async () => {
  dashBoardStore.getOverViewStats();
});

// Watch for filter changes
watch(
  () => dashboard.value.filterRange,
  () => {
    dashBoardStore.getOverViewStats();
  },
  { deep: true }
);

// Format group label for display (e.g. "received" -> "Received")
const formatLabel = (group: string): string =>
  group
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

// Tooltip mappings per category
const analysisMeta: Record<string, string> = {
  pending: "Analyses awaiting results from the laboratory",
  resulted: "Analyses with completed results ready for review or reporting",
};

const sampleMeta: Record<string, string> = {
  scheduled: "Samples scheduled for collection from patients",
  expected: "Samples expected to arrive at the laboratory",
  received: "Samples received and logged into the laboratory",
  awaiting: "Samples awaiting processing or assignment",
  approved: "Samples approved for reporting and release",
};

const worksheetMeta: Record<string, string> = {
  empty: "Worksheets with no sample or analysis assignments",
  awaiting: "Worksheets awaiting sample or analysis assignment",
  pending: "Worksheets with pending work or results to be entered",
};

const extraMeta: Record<string, string> = {
  "sample cancelled": "Samples that were cancelled before processing",
  "sample rejected": "Samples rejected by the laboratory (e.g. quality issues)",
  "sample invalidated": "Samples invalidated after initial processing",
  "analysis retracted": "Analyses with results that were retracted",
  "analysis retested": "Analyses that required retesting",
};

const getTooltip = (group: string, meta: Record<string, string>) =>
  meta[group.toLowerCase()] ?? group;
</script>

<template>
  <div class="mt-4">
    <div v-if="dashboard.fetchingOverViewStats" class="text-start my-4">
      <beak-loader message="Fetching updated overview stats..." />
    </div>

    <section v-else class="space-y-6">
      <!-- Analyses Status -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <h2 class="text-xl text-foreground font-semibold">Analyses Status</h2>
          <span
            class="cursor-help text-muted-foreground hover:text-primary transition-colors"
            title="Count of analyses grouped by result status (pending vs resulted)"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
        <hr class="my-2" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            v-for="analyte in dashboard.overViewStats?.analyses"
            :key="analyte.group"
            :title="formatLabel(analyte.group)"
            :value="String(analyte.count ?? 0)"
            variant="primary"
            :tooltip="getTooltip(analyte.group, analysisMeta)"
          />
        </div>
        <p v-if="!dashboard.overViewStats?.analyses?.length" class="my-4 text-muted-foreground">
          No analyses indicators found
        </p>
      </div>

      <!-- Sample Status -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <h2 class="text-xl text-foreground font-semibold">Sample Status</h2>
          <span
            class="cursor-help text-muted-foreground hover:text-primary transition-colors"
            title="Count of samples grouped by workflow status from scheduling to approval"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
        <hr class="my-2" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            v-for="sample in dashboard.overViewStats?.samples"
            :key="sample.group"
            :title="formatLabel(sample.group)"
            :value="String(sample.count ?? 0)"
            variant="primary"
            :tooltip="getTooltip(sample.group, sampleMeta)"
          />
        </div>
        <p v-if="!dashboard.overViewStats?.samples?.length" class="my-4 text-muted-foreground">
          No sample indicators found
        </p>
      </div>

      <!-- WorkSheet Status -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <h2 class="text-xl text-foreground font-semibold">WorkSheet Status</h2>
          <span
            class="cursor-help text-muted-foreground hover:text-primary transition-colors"
            title="Count of worksheets grouped by assignment and completion status"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
        <hr class="my-2" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            v-for="worksheet in dashboard.overViewStats?.worksheets"
            :key="worksheet.group"
            :title="formatLabel(worksheet.group)"
            :value="String(worksheet.count ?? 0)"
            variant="primary"
            :tooltip="getTooltip(worksheet.group, worksheetMeta)"
          />
        </div>
        <p v-if="!dashboard.overViewStats?.worksheets?.length" class="my-4 text-muted-foreground">
          No worksheet indicators found
        </p>
      </div>

      <!-- Extras -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <h2 class="text-xl text-foreground font-semibold">Extras</h2>
          <span
            class="cursor-help text-muted-foreground hover:text-primary transition-colors"
            title="Count of exceptional events: cancellations, rejections, invalidations, retractions, and retests"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
        <hr class="my-2" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            v-for="extra in dashboard.overViewStats?.extras"
            :key="extra.group"
            :title="formatLabel(extra.group)"
            :value="String(extra.count ?? 0)"
            variant="primary"
            :tooltip="getTooltip(extra.group, extraMeta)"
          />
        </div>
        <p v-if="!dashboard.overViewStats?.extras?.length" class="my-4 text-muted-foreground">
          No extra indicators found
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>
