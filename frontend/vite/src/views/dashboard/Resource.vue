<script setup lang="ts">
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";
import { storeToRefs } from "pinia";
import { onMounted, watch, reactive, ref } from "vue";
import { Chart } from "@antv/g2";
import modal from "../../components/SimpleModal.vue";
import dayjs from "dayjs";

import { useDashBoardStore } from "../../stores";

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

const localState = reactive({
  range: { from: "", to: "" },
});
let showModal = ref(false);

const setCustomRange = () => {
  dashBoardStore.setFilterRange(dayjs(localState.range.from), dayjs(localState.range.to));
  showModal.value = false;
};

onMounted(async () => {
  resetUserMatrix();
  dashBoardStore.setShowFilters(true);
  dashBoardStore.getResourceStats();
});

watch(
  () => dashboard.value.filterRange.from,
  (filter, prev) => {
    resetUserMatrix();
    dashBoardStore.getResourceStats();
  }
);

watch(
  () => dashboard.value.resourceStats?.samples,
  (samples, prev) => {
    dashboard.value.resourceStats?.samples?.forEach((group) => {
      let users: any[] = [];
      let total = 0;
      group.counts?.forEach((sample: any) => (total += sample.count));
      group.counts?.forEach((_c: any) => {
        users.push({
          item: _c.group,
          count: _c.count,
          percent: _c.count / total,
        });
      });
      plotUserMatrix(users, group.group, group.group);
    });
  }
);

const instrumentPerf = (count: number) => {
  let total = 0;
  dashboard.value.resourceStats?.instruments?.forEach(
    (inst: any) => (total += inst.count)
  );
  const pct = (count / total) * 100;
  return pct.toFixed(2) + " %";
};

const plotUserMatrix = (data: any, elem: string, grpName: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 250,
    width: 500,
    localRefresh: false,
  });

  chart.coordinate("theta", {
    radius: 0.75,
    innerRadius: 0.5,
  });

  chart.data(data);

  chart.scale("percent", {
    formatter: (val) => {
      val = (val * 100).toFixed(2) + "%";
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
    .position("percent")
    .color("item")
    .label("percent", {
      layout: [{ type: "pie-spider" }, { type: "hide-overlap" }],
      offset: 8,
      labelHeight: 38,
      content: (obj) => `${obj.item} (${obj.count})`,
      labelLine: {
        style: {
          lineWidth: 0.5,
        },
      },
    })
    .adjust("stack");

  const view = chart.createView();
  view.annotation().text({
    position: ["50%", "50%"],
    content: grpName,
    style: {
      fill: "#262626",
      textAlign: "center",
    },
  });

  chart.interaction("element-active");

  chart.render();
};

const resetUserMatrix = () => {
  document.getElementById("user-matrix")!.innerHTML = "";
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
    `;
  document.getElementById("user-matrix")!.innerHTML = template;
};
</script>

<template>
  <section class="flex justify-between">
    <div
      class="flex justify-end align-items-center mt-4 mb-8"
      v-show="dashboard.showFilters"
    >
      <VTooltip
        v-for="(filter, index) in dashboard.filters"
        :key="index"
        v-show="filter !== dashboard.filters[dashboard.filters.length]"
        :placements="['right-start']"
      >
        <button
          @click="dashBoardStore.setCurrentFilter(filter)"
          type="button"
          :class="[
            'px-2 py-1 mr-2 border-gray-800 border text-gray-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none',
            { 'bg-sky-800 text-white': dashboard.currentFilter === filter },
          ]"
        >
          {{ filter }}
        </button>
        <template #popper>{{ dashBoardStore.filterToolTip(filter) }}</template>
      </VTooltip>

      <button
        @click="showModal = true"
        class="ml-4 mr-1 px-2 py-1 border-gray-500 border text-gray-500 rounded-sm transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"
      >
        {{ dashboard.filterRange.from }} - {{ dashboard.filterRange.to }}
      </button>
      <!-- <button
        type="button"
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Apply
      </button> -->
    </div>
  </section>

  <div v-if="dashboard.fetchingResourceStats" class="text-start my-4 w-100">
    <LoadingMessage message="fetching resource stats ..." />
  </div>
  <section>
    <h1 class="text-xl text-gray-700 font-semibold">Instrument Matrix / Load</h1>
    <hr class="my-2" />
    <div v-if="dashboard.resourceStats?.instruments?.length === 0">NO DATA</div>
    <div v-else class="flex justify-start">
      <div
        v-for="instr in dashboard.resourceStats?.instruments"
        :key="instr.group"
        class="flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"
      >
        <span class="mr-4 font-bold text-gray-600 text-xl">{{
          instrumentPerf(instr?.count)
        }}</span>
        <span class="font-semibold text-gray-400 text-l">{{ instr.group }}</span>
      </div>
    </div>

    <h1 class="mt-8 text-xl text-gray-700 font-semibold">User Matrix / Load</h1>
    <hr class="my-2" />
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
  </section>

  <!-- Custome Dat Range Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/4'">
    <template v-slot:header>
      <h3>Custom Filter Date Range</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date From</span>
            <input
              type="datetime-local"
              class="form-input mt-1 block w-full"
              autocomplete="off"
              v-model="localState.range.from"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date To</span>
            <input
              type="datetime-local"
              class="form-input mt-1 block w-full"
              v-model="localState.range.to"
              placeholder="Name ..."
            />
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="setCustomRange()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>
