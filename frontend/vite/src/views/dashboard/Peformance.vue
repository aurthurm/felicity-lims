<template>
  <h1 class="text-xl text-gray-700 font-semibold">Process peformance in average days</h1>
  <hr class="my-2">
  <div class="flex flex-wrap justify-start">
    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">received to published</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">14 days</div>
      </div>
      <div id="process-rtp" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">received to published</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">14 days</div>
      </div>
      <div id="process-dtr" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">received to resulted</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">0.2 days</div>
      </div>
      <div id="process-rtr" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">resuted to verified</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">78 days</div>
      </div>
      <div id="process-rtv" class="mt-3"></div>
    </div>

    <div class="mr-4 items-center content-center">
      <div class="bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
        <div class="font-semibold text-gray-400 text-l">verified to published</div>
        <div class="mr-4 font-bold text-gray-600 text-xl">14 days</div>
      </div>
      <div id="process-vtp" class="mt-3"></div>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Process peformance by anayses service</h1>
  <hr class="my-2">
  <div id="process-service" class="mt-3"></div>

</template>

<script lang="ts">
import { defineComponent, onMounted} from 'vue'
import { Chart } from '@antv/g2';

export default defineComponent({
  name: "tab-peformance",
  setup() {

    const donutData = [
      { item: 'On-Time', count: 54, percent: 0.54 },
      { item: 'Delayed', count: 46, percent: 0.46 },
    ]
    const services = [
      { year: 'Viral Load', value: 130 },
      { year: 'HIV', value: 12 },
      { year: 'SARS COV2', value: 35 },
      { year: 'WBC', value: 111 },
      { year: 'RBC', value: 74 },
      { year: 'PLt', value: 13 },
      { year: 'serv1hh', value: 27 },
      { year: 'serv1er', value: 6 },
      { year: 'serv150', value: 168 },
    ];

    onMounted(() => {
        plotLateDonut(donutData, 'process-rtp')
        plotLateDonut(donutData, 'process-dtr')
        plotLateDonut(donutData, 'process-rtr')
        plotLateDonut(donutData, 'process-rtv')
        plotLateDonut(donutData, 'process-vtp')
        plotAnalyses(services, 'process-service')
    })

    return { 
    };
  },
});


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
    .position('year*value')
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