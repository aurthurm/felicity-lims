<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { onMounted, watch,  ref } from 'vue'
  import { Chart } from '@antv/g2';
  import { useDashBoardStore } from '../../stores';
  import { IProcess } from '../../stores/dashboard';

  const dashBoardStore = useDashBoardStore()
  const { dashboard: state } = storeToRefs(dashBoardStore)

  onMounted(() => {
    dashBoardStore.getSampleProcessPeformance()
    dashBoardStore.getAnalysisProcessPeformance()
  })

  watch(() => state.value.filterRange.from, (filter, prev) => {
    dashBoardStore.getSampleProcessPeformance()
  })

  const prRTP = ref({} as IProcess)
  const prRTS = ref({} as IProcess)
  const prSTV = ref({} as IProcess)
  const prVTP = ref({} as IProcess)
  watch(() => state.value.peformanceStats.sample, (processes, prev) => {
    processes?.forEach(process => {
      const donutData = [
        { item: 'On-Time', count: process?.counts?.totalNotLate, percent: (process?.counts?.totalNotLate/process?.counts?.totalSamples) * 100 },
        { item: 'Delayed', count: process?.counts?.totalLate, percent: (process?.counts?.totalLate/process?.counts?.totalSamples) * 100 },
      ]
      switch (process?.process) {
        case "received_to_published":
          prRTP.value = process;
          plotLateDonut(donutData, 'process-rtp')
          break;
        case "received_to_submitted":
          prRTS.value = process;
          plotLateDonut(donutData, 'process-rts')
          break;
        case "submitted_to_verified":
          prSTV.value = process;
          plotLateDonut(donutData, 'process-stv')
          break;
        case "verified_to_published":
          prVTP.value = process;
          plotLateDonut(donutData, 'process-vtp')
          break;
      
        default:
          break;
      }
    })
  })


  const analProcess = ref({} as IProcess)
  watch(() => state.value.currentPeformance, (process, prev) => {
    dashBoardStore.getAnalysisProcessPeformance()
  })
  watch(() => state.value.peformanceStats.analysis, (process, prev) => {
    analProcess.value = process[0]
    const services = [
      { analysis: 'Viral Load', value: 27 },
      { analysis: 'RBC', value: 74 },
      { analysis: 'PLt', value: 13 },
    ];
    process[0]?.groups?.forEach(group => {
      services.push({ analysis: group?.service, value: group?.processAverage })
    })
    plotAnalyses(services, 'process-service')
  })

  const plotAnalyses = (data:any, elem: string) => {
    const chart = new Chart({
      container: elem,
      autoFit: true,
      height: 300,
    });

    chart.data(data);

    chart.tooltip({
      showMarkers: false,
    });

    chart.coordinate().transpose();
    chart
      .interval()
      .position('analysis*value')
      .state({
        selected: {
          style: {
            fill: '#E8684A',
          }
        }
      });

    chart.interaction('element-selected');
    chart.render();
  }

  const plotLateDonut = (data: any, elem: string) => {
    const chart = new Chart({
      container: elem,
      autoFit: true,
      height: 150,
      width: 300,
    });
    chart.data(data);
    chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    chart.coordinate('theta', {
      radius: 0.75,
      innerRadius: 0.6,
    });
    chart.tooltip({
      showTitle: false,
      showMarkers: false,
      itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
    });
    chart
      .annotation()
    chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('item')
      .label('percent', (percent) => {
        return {
          content: (data) => {
            return `${percent * 100}%`;
          },
        };
      })
      .tooltip('item*percent', (item, percent) => {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent,
        };
      });

    chart.interaction('element-active');
    chart.render()
  }

</script>


<template>
  <h1 class="text-xl text-gray-700 font-semibold">Process peformance for samples in average days</h1>
  <hr class="my-2">
  <div class="flex flex-wrap justify-start">
    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">received to published</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">{{ prRTP?.counts?.processAverage ?? 0 }} days</div>
      </div>
      <div id="process-rtp" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">received to submitted</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">{{ prRTS?.counts?.processAverage ?? 0 }} days</div>
      </div>
      <div id="process-rts" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">submitted to verified</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">{{ prSTV?.counts?.processAverage ?? 0 }} days</div>
      </div>
      <div id="process-stv" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">verified to published</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">{{ prVTP?.counts?.processAverage ?? 0 }} days</div>
      </div>
      <div id="process-vtp" class="mt-3"></div>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">
    <span>Process peformance by anayses service</span>
    <select name="" id="" class="ml-8 p-1" @change="dashBoardStore.setCurrentPeformance($event)">
      <option 
      v-for="performance in state.performances" :key="performance"
      :value="performance"
      :selected="performance === state.currentPeformance"
      >{{ performance }}</option>
    </select>
  </h1>
  <hr class="my-2">
  <div id="process-service" class="mt-3"></div>

</template>
