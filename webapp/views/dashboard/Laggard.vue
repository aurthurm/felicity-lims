<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { useDashBoardStore } from "@/stores/dashboard";
import LaggardCard from "@/components/dashboard/LaggardCard.vue";

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

onMounted(() => {
  dashBoardStore.getSampleLaggards();
});

const daiData = computed(() => {
  const laggards = dashboard.value.laggards;
  if (!Array.isArray(laggards)) return null;
  return laggards.find(
    (l) => l?.category === "delayed_and_incomplete"
  );
});

const aadData = computed(() => {
  const laggards = dashboard.value.laggards;
  if (!Array.isArray(laggards)) return null;
  return laggards.find(
    (l) => l?.category === "authorised_already_delayed"
  );
});
</script>

<template>
  <div class="mt-4">
    <div v-if="dashboard.fetchingLaggards" class="text-start my-4">
      <beak-loader message="Fetching laggard stats..." />
    </div>

    <section v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LaggardCard
          title="Delayed & Incomplete"
          tooltip="Samples still in the workflow that are past their due date"
          :total="daiData?.counts?.totalIncomplete ?? 0"
          :on-time-count="daiData?.counts?.totalDelayed ?? 0"
          :delayed-count="daiData?.counts?.totalNotDelayed ?? 0"
          :less-than-ten="daiData?.counts?.lessThanTen ?? 0"
          :ten-to-twenty="daiData?.counts?.tenToTwenty ?? 0"
          :twenty-to-thirty="daiData?.counts?.twentyToThirty ?? 0"
          :grater-than-thirty="daiData?.counts?.graterThanThirty ?? 0"
          days-label="Days since created"
        />
        <LaggardCard
          title="Authorised & Past Due"
          tooltip="Samples that were authorised but are past their expected turnaround time"
          tooltip-position="right"
          :total="aadData?.counts?.totalIncomplete ?? 0"
          :on-time-count="aadData?.counts?.totalDelayed ?? 0"
          :delayed-count="aadData?.counts?.totalNotDelayed ?? 0"
          :less-than-ten="aadData?.counts?.lessThanTen ?? 0"
          :ten-to-twenty="aadData?.counts?.tenToTwenty ?? 0"
          :twenty-to-thirty="aadData?.counts?.twentyToThirty ?? 0"
          :grater-than-thirty="aadData?.counts?.graterThanThirty ?? 0"
          days-label="Days: created to authorised"
        />
      </div>
    </section>
  </div>
</template>
