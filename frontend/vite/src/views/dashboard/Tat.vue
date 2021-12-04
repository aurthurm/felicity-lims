<template>
  <h1 class="text-xl text-gray-700 font-semibold">Instrument Matrix / Load</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">23%</span>
      <span class="font-semibold text-gray-400 text-l">Roche</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">0.2%</span>
      <span class="font-semibold text-gray-400 text-l">Abbott</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">78%</span>
      <span class="font-semibold text-gray-400 text-l">Panther</span>
    </div>
    <div class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">14%</span>
      <span class="font-semibold text-gray-400 text-l">Manual</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">User Load / Matrix</h1>
  <hr class="my-2">
  <div class="flex flex-wrap justify-start">
    <!-- <div>
      <div id="user-matrix"></div>
    </div> -->
    <div>
      <div id="user-matrix2"></div>
    </div>
    <div>
      <div id="user-matrix3"></div>
    </div>
    <div>
      <div id="user-matrix4"></div>
    </div>
    <div>
      <div id="user-matrix5"></div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted} from 'vue'
import { Chart } from '@antv/g2';

export default defineComponent({
  name: "tab-tat",
  setup() {

  const usersA = [
    { type: 'precious', value: 34 },
    { type: 'ayanda', value: 85 },
    { type: 'moyon', value: 103 },
    { type: 'zvinavashet', value: 142 },
    { type: 'prosperk', value: 12 },
    { type: 'chambatis', value: 86 },
  ];

const user2 = [
  { item: 'samantha', count: 40, percent: 0.4 },
  { item: 'pamela', count: 21, percent: 0.21 },
  { item: 'sox', count: 17, percent: 0.17 },
  { item: 'johmndk', count: 13, percent: 0.13 },
  { item: 'mad,ax', count: 9, percent: 0.09 },
  { item: 'samantha2', count: 40, percent: 0.4 },
  { item: 'pamela3', count: 21, percent: 0.21 },
  { item: 'sox3', count: 17, percent: 0.17 },
  { item: 'johmndk3', count: 13, percent: 0.13 },
  { item: 'mad,ax3', count: 9, percent: 0.09 },
];
const user3 = [
  { item: 'pamela3', count: 21, percent: 0.21 },
  { item: 'sox3', count: 17, percent: 0.17 },
  { item: 'johmndk3', count: 13, percent: 0.13 },
  { item: 'mad,ax3', count: 9, percent: 0.09 },
];
const user4 = [
  { item: 'samantha', count: 40, percent: 0.4 },
  { item: 'pamela', count: 21, percent: 0.21 },
  { item: 'sox', count: 17, percent: 0.17 },
  { item: 'johmndk', count: 13, percent: 0.13 },
  { item: 'mad,ax', count: 9, percent: 0.09 },
  { item: 'sox3', count: 17, percent: 0.17 },
  { item: 'johmndk3', count: 13, percent: 0.13 },
  { item: 'mad,ax3', count: 9, percent: 0.09 },
];
const user5 = [
  { item: 'samantha', count: 40, percent: 0.4 },
  { item: 'pamela', count: 21, percent: 0.21 },
  { item: 'sox', count: 17, percent: 0.17 },
  { item: 'johmndk', count: 13, percent: 0.13 },
  { item: 'mad,ax', count: 9, percent: 0.09 },
  { item: 'samantha2', count: 40, percent: 0.4 },
];
  onMounted(() => {
    // plotUserLoad(usersA, 'user-matrix', '.', 'samples handles')
    plotUserMatrix(user2, 'user-matrix2', "Registration")
    plotUserMatrix(user3, 'user-matrix3', "Submission")
    plotUserMatrix(user4, 'user-matrix4', "Verification")
    plotUserMatrix(user5, 'user-matrix5', "Publication")
  })

    return { 
    };
  },
});

const plotUserMatrix = (data: any, elem: string, grpName: string) => {

const chart = new Chart({
  container: elem,
  autoFit: true,
  height: 250,
  width: 500,
  localRefresh: false,
});

chart.coordinate('theta', {
  radius: 0.75,
  innerRadius: 0.5,
});

chart.data(data);

chart.scale('percent', {
  formatter: (val) => {
    val = val * 100 + '%';
    return val;
  },
});

chart.tooltip({
  showTitle: false,
  showMarkers: false,
});

chart.legend(false);
chart
  .interval()
  .position('percent')
  .color('item')
  .label('percent', {
    layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
    offset: 8,
    labelHeight: 38,
    content:  (obj) => `${obj.item} (${obj.count})`,
    labelLine: {
      style: {
        lineWidth: 0.5,
      },
    },
  })
  .adjust('stack');

const view = chart.createView()
view.annotation().text({
  position: ['50%', '50%'],
  content: grpName,
  style: {
    fill: '#262626',
    textAlign: 'center',
  },
});

chart.interaction('element-active');

chart.render();

}

const plotUserLoad = (data: any, elem: string, xAlias: string, yAlias: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 300,
    width: 700,
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
      offset: 10,
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


</script>