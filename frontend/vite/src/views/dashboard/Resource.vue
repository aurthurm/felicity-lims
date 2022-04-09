
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onMounted, watch} from 'vue'
  import { Chart } from '@antv/g2';

  import { useDashBoardStore } from '../../stores';

  const dashBoardStore = useDashBoardStore()
  const { dashboard: state } = storeToRefs(dashBoardStore)

  onMounted(async () => { 
    dashBoardStore.getResourceStats()
  })

  watch(() => state.value.filterRange.from, (filter, prev) => {
    resetUserMatrix()
    dashBoardStore.getResourceStats();
  })

  watch(() => state.value.resourceStats?.samples, (samples, prev) => {
    state.value.resourceStats?.samples?.forEach(group => {
      let users: any[] = [];
      let total = 0; 
      group.counts?.forEach((sample: any) => total += sample.count);
      group.counts?.forEach((_c: any) => {
        users.push({
          item: _c.group, 
          count: _c.count, 
          percent: (_c.count/total)
        })
      })
      plotUserMatrix(users, group.group, group.group)
    })
  })

  const instrumentPerf = (count: number) => {
    let total = 0; 
    state.value.resourceStats?.instruments?.forEach((inst: any) => total += inst.count)
    const pct = (count/total)*100
    return pct.toFixed(2) + " %"
  }

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
        val = (val * 100).toFixed(2) + '%';
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

  const resetUserMatrix = () => {
    document.getElementById('user-matrix')!.innerHTML = ""
    const template = `
      <div>
        <div id="registration"></div>
      </div>
      <div>
        <div id="submission"></div>
      </div>
      <div>
        <div id="verification"></div>
      </div>
      <div>
        <div id="publication"></div>
      </div>
    `
    document.getElementById('user-matrix')!.innerHTML = template
  }

</script>

<template>
  <h1 class="text-xl text-gray-700 font-semibold">Instrument Matrix / Load</h1>
  <hr class="my-2">
  <div v-if="state.resourceStats?.instruments?.length === 0">
    NO DATA
  </div>
  <div v-else class="flex justify-start">
    <div v-for="instr in state.resourceStats?.instruments" :key="instr.group"
     class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">{{ instrumentPerf(instr?.count) }}</span>
      <span class="font-semibold text-gray-400 text-l">{{ instr.group }}</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">User Load / Matrix</h1>
  <hr class="my-2">
  <div class="flex flex-wrap justify-start" id="user-matrix">
      <div>
        <div id="registration"></div>
      </div>
      <div>
        <div id="submission"></div>
      </div>
      <div>
        <div id="verification"></div>
      </div>
      <div>
        <div id="publication"></div>
      </div>
  </div>

</template>
