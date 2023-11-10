<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, watch, ref, defineAsyncComponent } from "vue";
import { Chart } from "@antv/g2";
import { Bar } from "@antv/g2plot";
import { useDashBoardStore } from "../../stores";
import { IProcess } from "../../stores/dashboard";
const LoadingMessage = defineAsyncComponent(
  () => import("../../components/Spinners/LoadingMessage.vue")
)

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

onMounted(() => {
  dashBoardStore.getSampleProcessPeformance();
  dashBoardStore.getAnalysisProcessPeformance();
});

watch(
  () => dashboard.value.currentPeformancePeriod,
  (filter, prev) => {
    resetSampleGraphs();
    resetAPGraphs();
    dashBoardStore.getSampleProcessPeformance();
    dashBoardStore.getAnalysisProcessPeformance();
  }
);

const prRTP = ref({} as IProcess);
const prRTS = ref({} as IProcess);
const prSTV = ref({} as IProcess);
const prVTP = ref({} as IProcess);

watch(
  () => dashboard.value.peformanceStats.sample,
  (processes, prev) => {
    processes?.forEach((process) => {
      const donutData = [
        {
          item: "On-Time",
          count: process?.counts?.totalNotLate,
          percent: (process?.counts?.totalNotLate / process?.counts?.totalSamples) * 100,
        },
        {
          item: "Delayed",
          count: process?.counts?.totalLate,
          percent: (process?.counts?.totalLate / process?.counts?.totalSamples) * 100,
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

        default:
          break;
      }
    });
  }
);

const analProcess = ref({} as IProcess);

watch(
  () => dashboard.value.currentPeformance,
  (filter, prev) => {
    resetAPGraphs();
    dashBoardStore.getAnalysisProcessPeformance();
  }
);
watch(
  () => dashboard.value.peformanceStats.analysis,
  (process, prev) => {
    analProcess.value = process[0];
    const services: any[] = [];
    process[0]?.groups?.forEach((group) => {
      services.push({
        analysis: group?.service,
        value: group?.processAverage,
        total: group?.totalSamples,
      });
    });
    plotAnalyses(services, "process-service");
  }
);

const plotAnalyses = (data: any, elem: string) => {
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
      position: "middle", // 'left', 'middle', 'right'
    },
    minBarWidth: 5,
    maxBarWidth: 20,
  });
  barPlot.render();
};

const plotLateDonut = (data: any, elem: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 150,
    width: 300,
  });
  chart.data(data);
  chart.scale("percent", {
    formatter: (val) => {
      val = val * 100 + "%";
      return val;
    },
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
    .label("percent", (percent) => {
      return {
        content: (data) => {
          return `${percent * 100}%`;
        },
      };
    })
    .tooltip("item*percent", (item, percent) => {
      percent = percent * 100 + "%";
      return {
        name: item,
        value: percent,
      };
    });

  chart.interaction("element-active");
  chart.render();
};

const resetAPGraphs = () => {
  document.getElementById("ap-graphs")!.innerHTML = "";
  document.getElementById(
    "ap-graphs"
  )!.innerHTML = `<div id="process-service" class="mt-3"></div>`;
};
const resetSampleGraphs = () => {
  document.getElementById("rtp-graph")!.innerHTML = "";
  document.getElementById(
    "rtp-graph"
  )!.innerHTML = `<div id="process-rtp" class="mt-3"></div>`;
  document.getElementById("rts-graph")!.innerHTML = "";
  document.getElementById(
    "rts-graph"
  )!.innerHTML = `<div id="process-rts" class="mt-3"></div>`;
  document.getElementById("stv-graph")!.innerHTML = "";
  document.getElementById(
    "stv-graph"
  )!.innerHTML = `<div id="process-stv" class="mt-3"></div>`;
  document.getElementById("vtp-graph")!.innerHTML = "";
  document.getElementById(
    "vtp-graph"
  )!.innerHTML = `<div id="process-vtp" class="mt-3"></div>`;
};
</script>

<template>
  <hr />
  <section class="flex justify-end">
    <span>In the last</span>
    <select name="" id="" class="mx-4 p-1 bg-slate-300" @change="dashBoardStore.setCurrentPeformancePeriod($event)">
      <option v-for="period in dashboard.peformancePeriods" :key="period" :value="period"
        :selected="period === dashboard.currentPeformancePeriod">
        {{ period }}
      </option>
    </select>
    <span>days</span>
  </section>

  <hr />
  <h1 class="text-xl text-gray-700 font-semibold">
    Process peformance for samples in average days
  </h1>
  <hr class="mt-1 mb-2" />

  <div class="bg-slate-200 p-2 mb-4">
    <div v-if="dashboard.fetchingSampePeformanceStats" class="text-start my-4 w-100">
      <LoadingMessage message="fetching updated sample peformance stats ..." />
    </div>
    <div class="flex flex-wrap justify-start">
      <div class="mr-4 items-center content-center">
        <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
          <div class="font-semibold text-gray-400 text-l">received to published</div>
          <div class="mr-4 font-bold text-gray-600 text-xl">
            {{ prRTP?.counts?.processAverage ?? 0 }} days
          </div>
        </div>
        <div id="rtp-graph">
          <div id="process-rtp" class="mt-3"></div>
        </div>
      </div>

      <div class="mr-4 items-center content-center">
        <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
          <div class="font-semibold text-gray-400 text-l">received to submitted</div>
          <div class="mr-4 font-bold text-gray-600 text-xl">
            {{ prRTS?.counts?.processAverage ?? 0 }} days
          </div>
        </div>
        <div id="rts-graph">
          <div id="process-rts" class="mt-3"></div>
        </div>
      </div>

      <div class="mr-4 items-center content-center">
        <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
          <div class="font-semibold text-gray-400 text-l">submitted to verified</div>
          <div class="mr-4 font-bold text-gray-600 text-xl">
            {{ prSTV?.counts?.processAverage ?? 0 }} days
          </div>
        </div>
        <div id="stv-graph">
          <div id="process-stv" class="mt-3"></div>
        </div>
      </div>

      <div class="mr-4 items-center content-center">
        <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
          <div class="font-semibold text-gray-400 text-l">verified to published</div>
          <div class="mr-4 font-bold text-gray-600 text-xl">
            {{ prVTP?.counts?.processAverage ?? 0 }} days
          </div>
        </div>
        <div id="vtp-graph">
          <div id="process-vtp" class="mt-3"></div>
        </div>
      </div>
    </div>
  </div>

  <hr>
  <h1 class="mt-1 text-xl text-gray-700 font-semibold">
    <span>Process peformance by anayses service</span>
    <select name="" id="" class="ml-8 p-1 bg-slate-300 outline-none"
      @change="dashBoardStore.setCurrentPeformance($event)">
      <option v-for="performance in dashboard.performances" :key="performance" :value="performance"
        :selected="performance === dashboard.currentPeformance">
        {{ dashboard.perfs[performance] }}
      </option>
    </select>
  </h1>
  <hr class="mt-1 mb-2" />

  <div class=" bg-slate-200 p-2">
    <div v-if="dashboard.fetchingAnalysisPeformanceStats" class="text-start my-4 w-100">
      <LoadingMessage message="fetching analysis peformance stats ..." />
    </div>
    <div id="ap-graphs">
      <div id="process-service" class="mt-3"></div>
    </div>
  </div>
</template>
