<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, watch, ref } from "vue";
import { Chart } from "@antv/g2";
import { Bar } from "@antv/g2plot";
import { useDashBoardStore } from "@/stores/dashboard";
import { IProcess } from "@/stores/dashboard";

interface DonutData {
  item: string;
  count: number;
  percent: number;
}

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

onMounted(() => {
  dashBoardStore.getSampleProcessPeformance();
  dashBoardStore.getAnalysisProcessPeformance();
});

watch(
  () => dashboard.value.currentPeformancePeriod,
  () => {
    resetSampleGraphs();
    resetAPGraphs();
    dashBoardStore.getSampleProcessPeformance();
    dashBoardStore.getAnalysisProcessPeformance();
  }
);

watch(
  () => dashboard.value.peformanceStats.sample,
  (processes) => {
    processes?.forEach((process) => {
      const donutData: DonutData[] = [
        {
          item: "On-Time",
          count: process?.counts?.totalNotLate ?? 0,
          percent: process?.counts?.totalSamples ? (process.counts.totalNotLate / process.counts.totalSamples) * 100 : 0,
        },
        {
          item: "Delayed",
          count: process?.counts?.totalLate ?? 0,
          percent: process?.counts?.totalSamples ? (process.counts.totalLate / process.counts.totalSamples) * 100 : 0,
        },
      ];

      switch (process?.process) {
        case "received_to_published":
          prRTP.value = process;
          plotLateDonut(donutData, "process-rtp");
          break;
        case "received_to_submitted":
          prRTS.value = process;
          plotLateDonut(donutData, "process-rts");
          break;
        case "submitted_to_verified":
          prSTV.value = process;
          plotLateDonut(donutData, "process-stv");
          break;
        case "verified_to_published":
          prVTP.value = process;
          plotLateDonut(donutData, "process-vtp");
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

const plotLateDonut = (data: DonutData[], elem: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 150,
    width: 300,
  });

  chart.data(data);
  chart.scale("percent", {
    formatter: (val: number) => `${(val * 100).toFixed(2)}%`,
  });

  chart.coordinate("theta", {
    radius: 0.75,
    innerRadius: 0.6,
  });

  chart.tooltip({
    showTitle: false,
    showMarkers: false,
    itemTpl:
      '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
  });

  chart.annotation();
  chart
    .interval()
    .adjust("stack")
    .position("percent")
    .color("item")
    .label("percent", {
      content: (data: any) => `${(data.percent * 100).toFixed(2)}%`,
    })
    .tooltip("item*percent", (item: string, percent: number) => ({
      name: item,
      value: `${(percent * 100).toFixed(2)}%`,
    }));

  chart.interaction("element-active");
  chart.render();
};

const resetAPGraphs = () => {
  const apGraphs = document.getElementById("ap-graphs");
  if (apGraphs) {
    apGraphs.innerHTML = `<div id="process-service" class="mt-3"></div>`;
  }
};

const resetSampleGraphs = () => {
  const graphs = ["rtp-graph", "rts-graph", "stv-graph", "vtp-graph"];
  const processes = ["process-rtp", "process-rts", "process-stv", "process-vtp"];
  
  graphs.forEach((graphId, index) => {
    const graph = document.getElementById(graphId);
    if (graph) {
      graph.innerHTML = `<div id="${processes[index]}" class="mt-3"></div>`;
    }
  });
};
</script>

<template>
  <div class="mt-4">
    <section class="flex justify-end items-center mb-4">
      <span class="text-foreground">In the last</span>
      <select 
        class="mx-4 p-1 bg-muted rounded-sm border border-border" 
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

    <div class="bg-muted p-4 rounded-sm">
      <div v-if="dashboard.fetchingSampePeformanceStats" class="text-start my-4">
        <fel-loader message="Fetching updated sample performance stats..." />
      </div>
      
      <div class="flex flex-wrap justify-start gap-4">
        <div class="flex flex-col items-center">
          <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
            <div class="font-semibold text-muted-foreground">Received to Published</div>
            <div class="font-bold text-foreground text-xl">
              {{ prRTP?.counts?.processAverage ?? 0 }} days
            </div>
          </div>
          <div id="rtp-graph" class="mt-3">
            <div id="process-rtp"></div>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
            <div class="font-semibold text-muted-foreground">Received to Submitted</div>
            <div class="font-bold text-foreground text-xl">
              {{ prRTS?.counts?.processAverage ?? 0 }} days
            </div>
          </div>
          <div id="rts-graph" class="mt-3">
            <div id="process-rts"></div>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
            <div class="font-semibold text-muted-foreground">Submitted to Verified</div>
            <div class="font-bold text-foreground text-xl">
              {{ prSTV?.counts?.processAverage ?? 0 }} days
            </div>
          </div>
          <div id="stv-graph" class="mt-3">
            <div id="process-stv"></div>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
            <div class="font-semibold text-muted-foreground">Verified to Published</div>
            <div class="font-bold text-foreground text-xl">
              {{ prVTP?.counts?.processAverage ?? 0 }} days
            </div>
          </div>
          <div id="vtp-graph" class="mt-3">
            <div id="process-vtp"></div>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h1 class="mt-1 text-xl text-foreground font-semibold">
      <span>Process peformance by anayses service</span>
      <select name="" id="" class="ml-8 p-1 bg-muted outline-none"
        @change="dashBoardStore.setCurrentPeformance($event)">
        <option v-for="performance in dashboard.performances" :key="performance" :value="performance"
          :selected="performance === dashboard.currentPeformance">
          {{ dashboard.perfs[performance] }}
        </option>
      </select>
    </h1>
    <hr class="mt-1 mb-2" />

    <div class=" bg-muted p-2">
      <div v-if="dashboard.fetchingAnalysisPeformanceStats" class="text-start my-4 w-100">
        <fel-loader message="fetching analysis peformance stats ..." />
      </div>
      <div id="ap-graphs">
        <div id="process-service" class="mt-3"></div>
      </div>
    </div>
    
  </div>
</template>
