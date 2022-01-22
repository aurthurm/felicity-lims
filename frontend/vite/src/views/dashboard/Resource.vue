<template>
  <h1 class="text-xl text-gray-700 font-semibold">Instrument Matrix / Load</h1>
  <hr class="my-2">
  <div class="flex justify-start">
    <div v-for="instr in state.resourceStats?.value.instruments" :key="instr.group"
     class="flex items-center bg-white shadow rounded px-6 pt-3 pb-5 border border-white mr-8">
      <span class="mr-4 font-bold text-gray-600 text-xl">{{ instrumentPerf(instr?.count) }}</span>
      <span class="font-semibold text-gray-400 text-l">{{ instr.group }}</span>
    </div>
  </div>

  <h1 class="mt-4 text-xl text-gray-700 font-semibold">User Load / Matrix</h1>
  <hr class="my-2">
  <div class="flex flex-wrap justify-start">
    <!-- <div>
      <div id="user-matrix"></div>
    </div> -->
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

<script setup lang="ts">
  import { onMounted} from 'vue'
  import { Chart } from '@antv/g2';

  import useDashBoardComposable from '../../modules/dashboard';

  const { state, getResourceStats } = useDashBoardComposable()

  onMounted(async () => { 
    await getResourceStats()
    state.resourceStats?.value.samples?.forEach(group => {
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
    state.resourceStats?.value.instruments?.forEach((inst: any) => total += inst.count)
    const pct = (count/total)*100
    return pct + " %"
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