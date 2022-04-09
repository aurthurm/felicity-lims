<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { onMounted, watch,  ref } from 'vue'
  import { Chart } from '@antv/g2';
  import { useDashBoardStore } from '../../stores';

  const dashBoardStore = useDashBoardStore()
  const { dashboard: state } = storeToRefs(dashBoardStore)

  const totalIncompleteDAI = ref(0)
  const totalIncompleteAAD = ref(0)

  onMounted(() => {
    dashBoardStore.getSampleLaggards()
  })

  watch(() => state.value.filterRange.from, (filter, prev) => {
    resetLateActive()
    resetLateAuth()
    dashBoardStore.getSampleLaggards();
  })

  watch(() => state.value.laggards, (laggards, prev) => {
    const dai = laggards?.filter(laggard => laggard?.category === "delayed_and_incomplete")[0]
    const aad = laggards?.filter(laggard => laggard?.category === "authorised_already_delayed")[0]

    // Already Delayed
    totalIncompleteDAI.value = dai?.counts?.totalIncomplete ?? 0
    const donutData = [
      { item: 'On-Time', count: dai?.counts?.totalDelayed, percent: (dai?.counts?.totalDelayed/dai?.counts?.totalIncomplete) * 100 },
      { item: 'Delayed', count: dai?.counts?.totalNotDelayed, percent: (dai?.counts?.totalNotDelayed/dai?.counts?.totalIncomplete) * 100 },
    ]
    plotLateDonut(donutData, 'late-active-donut')

    const sinceData = [
      { type: '<10', value: dai?.counts?.lessThanTen },
      { type: '10 - 20', value: dai?.counts?.tenToTwenty },
      { type: '20 - 30', value: dai?.counts?.twentyToThirty },
      { type: '> 30', value: dai?.counts?.graterThanThirty },
    ];
    plotLateSince(sinceData, 'late-active-since', 'days since created', 'number of samples')

    // Authosised already delayed
    totalIncompleteAAD.value = aad?.counts?.totalIncomplete ?? 0
    const donutData2 = [
      { item: 'On-Time', count: aad?.counts?.totalDelayed, percent: (aad?.counts?.totalDelayed/aad?.counts?.totalIncomplete) * 100 },
      { item: 'Delayed', count: aad?.counts?.totalNotDelayed, percent: (aad?.counts?.totalNotDelayed/aad?.counts?.totalIncomplete) * 100 },
    ]
    plotLateDonut(donutData2, 'late-auth-donut')
    const sinceData2 = [
        { type: '<10', value: aad?.counts?.lessThanTen },
        { type: '10 - 20', value: aad?.counts?.tenToTwenty },
        { type: '20 - 30', value: aad?.counts?.twentyToThirty },
        { type: '> 30', value: aad?.counts?.graterThanThirty },
    ];

    plotLateSince(sinceData2, 'late-auth-since', 'days: created to authorised', 'number of samples')
  })

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

  const resetLateActive = () => {
    document.getElementById('late-active')!.innerHTML = ""
    const template = `
      <div class="mx-8">
        <div id="late-active-donut"></div>
      </div>
      <div>
        <div id="late-active-since"></div>
      </div>
    `
    document.getElementById('late-active')!.innerHTML = template
  }

  const resetLateAuth = () => {
    document.getElementById('late-auth')!.innerHTML = ""
    const template = `
      <div class="mx-8">
        <div id="late-auth-donut"></div>
      </div>
      <div>
        <div id="late-auth-since"></div>
      </div>
    `
    document.getElementById('late-auth')!.innerHTML = template
  }
</script>

<template>
    
  <h1 class="text-xl text-gray-700 font-semibold">Delayed and incomplete</h1>
  <hr class="my-2">
  <div class="flex justify-start items-center">
    <div class="content-middle bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
      <div class="mr-4 font-bold text-gray-600 text-2xl">{{ totalIncompleteDAI }}</div>
      <div class="font-semibold text-gray-400 text-l">Already Delayed</div>
    </div>
    <div id="late-active" class="flex justify-start items-center ms-8">
      <div class="me-8">
        <div id="late-active-donut"></div>
      </div>
      <div>
        <div id="late-active-since"></div>
      </div>
    </div>
  </div>
    
  <h1 class="mt-4 text-xl text-gray-700 font-semibold">Authosised already delayed</h1>
  <hr class="my-2">
  <div class="flex justify-start items-center">
    <div class="content-middle bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8 text-center">
      <div class="mr-4 font-bold text-gray-600 text-2xl">{{ totalIncompleteAAD }}</div>
      <div class="font-semibold text-gray-400 text-l">Released as Delayed</div>
    </div>
    <div id="late-auth" class="flex justify-start items-center ms-8">
      <div class="me-8">
        <div id="late-auth-donut"></div>
      </div>
      <div>
        <div id="late-auth-since"></div>
      </div>
    </div>
  </div>

</template>
