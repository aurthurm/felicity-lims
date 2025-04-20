<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
import { useDashBoardStore } from "@/stores/dashboard";

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
      <fel-loader message="Fetching updated overview stats..." />
    </div>

    <section v-else>
      <!-- Analyses Status -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Analyses Status</h1>
        <hr class="my-2" />
        <div class="flex justify-start">
          <div
            v-for="analyte in dashboard.overViewStats?.analyses"
            :key="analyte.group"
            class="flex items-center bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground mr-8"
          >
            <span class="mr-4 font-bold text-foreground text-xl">{{ analyte.count }}</span>
            <span class="font-semibold text-muted-foreground text-l">{{ analyte.group }}</span>
          </div>
        </div>
        <p v-if="!dashboard.overViewStats?.analyses?.length" class="my-4 text-muted-foreground">
          No analyses indicators found
        </p>
      </div>

      <!-- Sample Status -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Sample Status</h1>
        <hr class="my-2" />
        <div class="flex justify-start">
          <div
            v-for="sample in dashboard.overViewStats?.samples"
            :key="sample.group"
            class="flex items-center bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground mr-8"
          >
            <span class="mr-4 font-bold text-foreground text-xl">{{ sample.count }}</span>
            <span class="font-semibold text-muted-foreground text-l">{{ sample.group }}</span>
          </div>
        </div>
        <p v-if="!dashboard.overViewStats?.samples?.length" class="my-4 text-muted-foreground">
          No sample indicators found
        </p>
      </div>

      <!-- WorkSheet Status -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">WorkSheet Status</h1>
        <hr class="my-2" />
        <div class="flex justify-start">
          <div
            v-for="worksheet in dashboard.overViewStats?.worksheets"
            :key="worksheet.group"
            class="flex items-center bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground mr-8"
          >
            <span class="mr-4 font-bold text-foreground text-xl">{{ worksheet.count }}</span>
            <span class="font-semibold text-muted-foreground text-l">{{ worksheet.group }}</span>
          </div>
        </div>
        <p v-if="!dashboard.overViewStats?.worksheets?.length" class="my-4 text-muted-foreground">
          No worksheet indicators found
        </p>
      </div>

      <!-- Extras -->
      <div class="mb-6">
        <h1 class="text-xl text-foreground font-semibold">Extras</h1>
        <hr class="my-2" />
        <div class="flex justify-start">
          <div
            v-for="extra in dashboard.overViewStats?.extras"
            :key="extra.group"
            class="flex items-center bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground mr-8"
          >
            <span class="mr-4 font-bold text-foreground text-xl">{{ extra.count }}</span>
            <span class="font-semibold text-muted-foreground text-l">{{ extra.group }}</span>
          </div>
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
