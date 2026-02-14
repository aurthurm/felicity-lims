<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, watch, ref } from "vue";
import { Bar } from "@antv/g2plot";
import { useDashBoardStore } from "@/stores/dashboard";
import { IProcess } from "@/stores/dashboard";
import ProcessPerformanceCard from "@/components/dashboard/ProcessPerformanceCard.vue";

interface ServiceData {
  analysis: string;
  value: number;
  total: number;
}

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

const prRTP = ref<IProcess>({} as IProcess);
const prRTS = ref<IProcess>({} as IProcess);
const prSTV = ref<IProcess>({} as IProcess);
const prVTP = ref<IProcess>({} as IProcess);
const analProcess = ref<IProcess>({} as IProcess);

const onTimePercent = (process: IProcess) => {
  const c = process?.counts;
  if (!c?.totalSamples) return 0;
  return Math.round((c.totalNotLate / c.totalSamples) * 100);
};

onMounted(() => {
  dashBoardStore.getSampleProcessPeformance();
  dashBoardStore.getAnalysisProcessPeformance();
});

watch(
  () => dashboard.value.currentPeformancePeriod,
  () => {
    resetAPGraphs();
    dashBoardStore.getSampleProcessPeformance();
    dashBoardStore.getAnalysisProcessPeformance();
  }
);

watch(
  () => dashboard.value.peformanceStats.sample,
  (processes) => {
    processes?.forEach((process) => {
      switch (process?.process) {
        case "received_to_published":
          prRTP.value = process;
          break;
        case "received_to_submitted":
          prRTS.value = process;
          break;
        case "submitted_to_verified":
          prSTV.value = process;
          break;
        case "verified_to_published":
          prVTP.value = process;
          break;
      }
    });
  }
);

watch(
  () => dashboard.value.currentPeformance,
  () => {
    resetAPGraphs();
    dashBoardStore.getAnalysisProcessPeformance();
  }
);

watch(
  () => dashboard.value.peformanceStats.analysis,
  (process) => {
    if (process?.[0]) {
      analProcess.value = process[0];
      const services: ServiceData[] = process[0].groups?.map((group) => ({
        analysis: group?.service ?? "",
        value: group?.processAverage ?? 0,
        total: group?.totalSamples ?? 0,
      })) ?? [];
      plotAnalyses(services, "process-service");
    }
  }
);

const plotAnalyses = (data: ServiceData[], elem: string) => {
  const barPlot = new Bar(elem, {
    data,
    xField: "value",
    yField: "analysis",
    seriesField: "",
    meta: {
      analysis: {
        alias: "Analysis",
      },
      value: {
        alias: "process average in days",
      },
    },
    label: {
      position: "middle",
    },
    minBarWidth: 5,
    maxBarWidth: 20,
  });
  barPlot.render();
};

const resetAPGraphs = () => {
  const apGraphs = document.getElementById("ap-graphs");
  if (apGraphs) {
    apGraphs.innerHTML = `<div id="process-service" class="mt-3"></div>`;
  }
};
</script>

<template>
  <div class="mt-4">
    <section class="flex justify-end items-center mb-4">
      <span class="text-foreground">In the last</span>
      <select 
        class="mx-4 p-1 bg-background rounded-sm border border-border" 
        @change="dashBoardStore.setCurrentPeformancePeriod($event)"
      >
        <option 
          v-for="period in dashboard.peformancePeriods" 
          :key="period" 
          :value="period"
          :selected="period === dashboard.currentPeformancePeriod"
        >
          {{ period }}
        </option>
      </select>
      <span class="text-foreground">days</span>
    </section>

    <h1 class="text-xl text-foreground font-semibold">
      Process performance for samples in average days
    </h1>
    <hr class="my-2" />

    <div class="p-4">
      <div v-if="dashboard.fetchingSampePeformanceStats" class="text-start my-4">
        <beak-loader message="Fetching updated sample performance stats..." />
      </div>
      
      <div class="flex flex-wrap justify-start gap-4">
        <ProcessPerformanceCard
          title="Received to Published"
          :process-average="prRTP?.counts?.processAverage ?? 0"
          :on-time-percent="onTimePercent(prRTP)"
          :selected="dashboard.currentPeformance === 'received_to_published'"
          tooltip="Average days from sample receipt to final publication of results"
          @click="dashBoardStore.setCurrentPeformanceById('received_to_published')"
        />
        <ProcessPerformanceCard
          title="Received to Submitted"
          :process-average="prRTS?.counts?.processAverage ?? 0"
          :on-time-percent="onTimePercent(prRTS)"
          :selected="dashboard.currentPeformance === 'received_to_submitted'"
          tooltip="Average days from sample receipt to result submission"
          @click="dashBoardStore.setCurrentPeformanceById('received_to_submitted')"
        />
        <ProcessPerformanceCard
          title="Submitted to Verified"
          :process-average="prSTV?.counts?.processAverage ?? 0"
          :on-time-percent="onTimePercent(prSTV)"
          :selected="dashboard.currentPeformance === 'submitted_to_verified'"
          tooltip="Average days from submission to verification of results"
          @click="dashBoardStore.setCurrentPeformanceById('submitted_to_verified')"
        />
        <ProcessPerformanceCard
          title="Verified to Published"
          :process-average="prVTP?.counts?.processAverage ?? 0"
          :on-time-percent="onTimePercent(prVTP)"
          :selected="dashboard.currentPeformance === 'verified_to_published'"
          tooltip="Average days from verification to publication of results"
          @click="dashBoardStore.setCurrentPeformanceById('verified_to_published')"
        />
      </div>
      <p class="text-sm text-muted-foreground mt-2">
        Click a card above to view the performance breakdown by involved analysis services.
      </p>
    </div>

    <hr>

    <h1 class="mt-1 text-xl text-foreground font-semibold">
      Process peformance by anayses service
      <span v-if="dashboard.currentPeformance" class="text-muted-foreground font-normal">
        — {{ dashboard.perfs[dashboard.currentPeformance] }}
      </span>
    </h1>
    <hr class="mt-1 mb-2" />

    <div class="p-2">
      <div v-if="dashboard.fetchingAnalysisPeformanceStats" class="text-start my-4 w-100">
        <beak-loader message="fetching analysis peformance stats ..." />
      </div>
      <div id="ap-graphs">
        <div id="process-service" class="mt-3"></div>
      </div>
    </div>
    
  </div>
</template>
