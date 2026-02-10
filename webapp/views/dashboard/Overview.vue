<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
import { useDashBoardStore } from "@/stores/dashboard";
import StatCard from "@/components/common/StatCard.vue";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

defineOptions({ name: 'OverviewView' })
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
</script>

<template>
  <div class="mt-4">
    <div v-if="dashboard.fetchingOverViewStats" class="text-start my-4">
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Fetching updated overview stats...</span>
      </span>
    </div>

    <section v-else>
      <!-- Sample Metrics -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Sample Metrics</h1>
        <hr class="my-2" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <StatCard
            v-for="sample in dashboard.overViewStats?.samples"
            :key="sample.group"
            :label="sample.group"
            :tooltip="`The total number of samples in ${sample.group} status`"
          >
            {{ sample.count }}
          </StatCard>
        </div>
        <Empty v-if="!dashboard.overViewStats?.samples?.length" class="my-4 border-0 bg-transparent p-0">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No sample indicators</EmptyTitle>
              <EmptyDescription>No sample metrics available for this range.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>

      <!-- Analyses Metrics -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Analyses Metrics</h1>
        <hr class="my-2" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <StatCard
            v-for="analyte in dashboard.overViewStats?.analyses"
            :key="analyte.group"
            :label="analyte.group"
            :tooltip="`The total number of analyses in ${analyte.group} status`"
          >
            {{ analyte.count }}
          </StatCard>
        </div>
        <Empty v-if="!dashboard.overViewStats?.analyses?.length" class="my-4 border-0 bg-transparent p-0">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No analyses indicators</EmptyTitle>
              <EmptyDescription>No analysis metrics available for this range.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>

      <!-- WorkSheet Metrics -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">WorkSheet Metrics</h1>
        <hr class="my-2" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <StatCard
            v-for="worksheet in dashboard.overViewStats?.worksheets"
            :key="worksheet.group"
            :label="worksheet.group"
            :tooltip="`The total number of worksheets in ${worksheet.group} status`"
          >
            {{ worksheet.count }}
          </StatCard>
        </div>
        <Empty v-if="!dashboard.overViewStats?.worksheets?.length" class="my-4 border-0 bg-transparent p-0">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No worksheet indicators</EmptyTitle>
              <EmptyDescription>No worksheet metrics available for this range.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>

      <!-- Extras Metrics -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Extras Metrics</h1>
        <hr class="my-2" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <StatCard
            v-for="extra in dashboard.overViewStats?.extras"
            :key="extra.group"
            :label="extra.group"
            :tooltip="`The total number of extras in ${extra.group} status`"
          >
            {{ extra.count }}
          </StatCard>
        </div>
        <Empty v-if="!dashboard.overViewStats?.extras?.length" class="my-4 border-0 bg-transparent p-0">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No extra indicators</EmptyTitle>
              <EmptyDescription>No extra metrics available for this range.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>
