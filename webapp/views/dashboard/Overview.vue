<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onMounted, watch } from "vue";
import { useDashBoardStore } from "@/stores/dashboard";
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

onMounted(async () => {
  dashBoardStore.getOverViewStats();
});

watch(
  () => dashboard.value.filterRange,
  (filter, prev) => {
    dashBoardStore.getOverViewStats();
  },
  { deep: true }
);
</script>

<template>

  <div v-if="dashboard.fetchingOverViewStats" class="text-start my-4 w-100">
    <LoadingMessage message="fetching updated overview stats ..." />
  </div>
  <section class="mt-4">
  
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
    <p v-if="!dashboard.overViewStats?.analyses?.length" class="my-4">I did not find any analyses indicators to show</p>

    <h1 class="mt-4 text-xl text-foreground font-semibold">Sample Status</h1>
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
    <p v-if="!dashboard.overViewStats?.samples?.length" class="my-4">I did not find any sample indicators to show</p>

    <h1 class="mt-4 text-xl text-foreground font-semibold">WorkSheet Status</h1>
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
    <p v-if="!dashboard.overViewStats?.worksheets?.length" class="my-4">I did not find any worksheet indicators to show</p>

    <h1 class="mt-4 text-xl text-foreground font-semibold">Extras</h1>
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
      <p v-if="!dashboard.overViewStats?.extras?.length" class="my-4">I did not find any extra indicators to show</p>
    </div>
  </section>
</template>
