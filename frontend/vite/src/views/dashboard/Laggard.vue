<template>
    
  <h1 class="text-xl text-gray-700 font-semibold">Delayed and incomplete</h1>
  <hr class="my-2">
  <div class="flex justify-start items-center">
    <div class="content-middle bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
      <div class="mr-4 font-bold text-gray-600 text-2xl">236</div>
      <div class="font-semibold text-gray-400 text-l">Already Delayed</div>
    </div>
    <div class="mx-8">
      <div id="late-active-donut"></div>
    </div>
    <div>
      <div id="late-active-since"></div>
    </div>
  </div>
    
  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Authosised already delayed</h1>
  <hr class="my-2">
  <div class="flex justify-start items-center">
    <div class="content-middle bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
      <div class="mr-4 font-bold text-gray-600 text-2xl">132</div>
      <div class="font-semibold text-gray-400 text-l">Released as Delayed</div>
    </div>
    <div class="mx-8">
      <div id="late-auth-donut"></div>
    </div>
    <div>
      <div id="late-auth-since"></div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { Chart } from '@antv/g2';

export default defineComponent({
  name: "tab-laggards",
  setup() {

  const donutData = [
      { item: 'On-Time', count: 54, percent: 0.54 },
      { item: 'Delayed', count: 46, percent: 0.46 },
    ]
  const donutData2 = [
      { item: 'On-Time', count: 54, percent: 0.54 },
      { item: 'Delayed', count: 46, percent: 0.46 },
    ]
  const sinceData = [
    { type: '<10', value: 34 },
    { type: '10 - 20', value: 85 },
    { type: '20 - 30', value: 103 },
    { type: '> 30', value: 142 },
  ];
  const sinceData2 = [
    { type: '<10', value: 2 },
    { type: '10 - 20', value: 17 },
    { type: '20 - 30', value: 23 },
  ];

    onMounted(() => {
      plotLateDonut(donutData, 'late-active-donut')
      plotLateSince(sinceData, 'late-active-since', 'days since created', 'number of samples')
      //plotLateActive
      plotLateDonut(donutData2, 'late-auth-donut')
      plotLateSince(sinceData2, 'late-auth-since', 'days: created to authorised', 'number of samples')
    })

    return { 
    };
  },
});

const plotLateSince = (data: any, elem: string, xAlias: string, yAlias: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 200,
    width: 600,
  });
  chart.data(data);
  chart.scale({
    value: {
      max: 150,
      min: 0,
      alias: yAlias,
    },
    type: {
      alias: xAlias,
    }
  });
  chart.axis('type', {
    title: {
      offset: 60,
      style: {
        fontSize: 12,
        fontWeight: 300,
      },
    },
    tickLine: null,
    line: null,
  });
  chart.axis('value', {
    label: null,
    title: {
      offset: 30,
      style: {
        fontSize: 12,
        fontWeight: 300,
      },
    },
  });
  chart.legend(false);
  chart.coordinate().transpose();
  chart
    .interval()
    .position('type*value')
    .size(26)
    .label('value', {
      style: {
        fill: '#8d8d8d',
      },
      offset: 10,
    });
  chart.interaction('element-active');
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
          return `${data.item}: ${percent * 100}%`;
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