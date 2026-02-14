<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, watch, reactive, ref } from "vue";
import { Chart } from "@antv/g2";
import dayjs from "dayjs";
import { useDashBoardStore } from "@/stores/dashboard";
import StatCard from "@/components/ui/StatCard.vue";

// Initialize store
const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

// Local state
const localState = reactive({
  range: { from: "", to: "" },
});
const showModal = ref(false);

// Event handlers
const setCustomRange = () => {
  dashBoardStore.setFilterRange(dayjs(localState.range.from), dayjs(localState.range.to));
  showModal.value = false;
};

// Load initial data
onMounted(async () => {
  resetUserMatrix();
  dashBoardStore.setShowFilters(true);
  dashBoardStore.getResourceStats();
});

// Watch for filter changes
watch(
  () => dashboard.value.filterRange.from,
  () => {
    resetUserMatrix();
    dashBoardStore.getResourceStats();
  }
);

// Watch for sample stats changes
watch(
  () => dashboard.value.resourceStats?.samples,
  (samples) => {
    samples?.forEach((group) => {
      interface UserData {
        item: string;
        count: number;
        percent: number;
      }
      const users: UserData[] = [];
      const total = group.counts?.reduce((sum: number, sample: any) => sum + sample.count, 0) || 0;
      
      group.counts?.forEach((count: any) => {
        users.push({
          item: count.group,
          count: count.count,
          percent: count.count / total,
        });
      });
      
      plotUserMatrix(users, group.group, group.group);
    });
  }
);

// Helper functions
const instrumentPerf = (count: number) => {
  const total = dashboard.value.resourceStats?.instruments?.reduce(
    (sum: number, inst: any) => sum + inst.count, 0
  ) || 0;
  const pct = (count / total) * 100;
  return `${pct.toFixed(2)}%`;
};

const plotUserMatrix = (data: any[], elem: string, grpName: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 250,
    width: 500,
  });

  chart.options({
    type: 'view',
    data: data,
    coordinate: { type: 'theta', innerRadius: 0.5, outerRadius: 0.75 },
    scale: {
      color: { type: 'ordinal' },
    },
    legend: false,
    tooltip: {
      title: false,
      items: [
        (d: any) => ({
          name: d.item,
          value: `${(d.percent * 100).toFixed(2)}%`,
        }),
      ],
    },
    interaction: { elementHighlight: true },
    children: [
      {
        type: 'interval',
        encode: { y: 'percent', color: 'item' },
        transform: [{ type: 'stackY' }],
        labels: [
          {
            text: (d: any) => `${d.item} (${d.count})`,
            position: 'spider',
            connectorDistance: 8,
            connectorLineWidth: 0.5,
          },
        ],
      },
      {
        type: 'text',
        style: {
          text: grpName,
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 14,
          fill: 'hsl(var(--foreground))',
        },
      },
    ],
  });

  chart.render();
};

const resetUserMatrix = () => {
  const userMatrix = document.getElementById("user-matrix");
  if (userMatrix) {
    userMatrix.innerHTML = `
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
  }
};
</script>

<template>
  <div class="mt-4">
    <!-- Filters Section -->
    <section class="flex justify-between mb-8">
      <div
        class="flex justify-end items-center"
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
              'px-2 py-1 mr-2 border border-foreground text-foreground rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none',
              { 'bg-primary text-primary-foreground': dashboard.currentFilter === filter },
            ]"
          >
            {{ filter }}
          </button>
          <template #popper>{{ dashBoardStore.filterToolTip(filter) }}</template>
        </VTooltip>

        <button
          @click="showModal = true"
          class="ml-4 mr-1 px-2 py-1 border border-border text-muted-foreground rounded-sm transition duration-300 hover:bg-muted hover:text-primary-foreground focus:outline-none"
        >
          {{ dashboard.filterRange.from }} - {{ dashboard.filterRange.to }}
        </button>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="dashboard.fetchingResourceStats" class="text-start my-4">
      <beak-loader message="Fetching resource stats..." />
    </div>

    <!-- Content Section -->
    <section>
      <!-- Instrument Matrix -->
      <div class="mb-8">
        <h1 class="text-xl text-foreground font-semibold">Instrument Matrix / Load</h1>
        <hr class="my-2" />
        <div v-if="!dashboard.resourceStats?.instruments?.length" class="text-muted-foreground">
          No instrument data available
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            v-for="instr in dashboard.resourceStats?.instruments"
            :key="instr.group"
            :title="instr.group"
            :value="instrumentPerf(instr?.count)"
            variant="primary"
            tooltip="Percentage of total analyses run on this instrument within the selected date range"
          />
        </div>
      </div>

      <!-- User Matrix -->
      <div class="mb-8">
        <h1 class="text-xl text-foreground font-semibold">User Matrix / Load</h1>
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
      </div>
    </section>

    <!-- Custom Date Range Modal -->
    <beak-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/4'">
      <template v-slot:header>
        <h3>Custom Filter Date Range</h3>
      </template>

      <template v-slot:body>
        <form action="post" class="p-1">
          <div class="grid grid-cols-2 gap-x-4 mb-4">
            <label class="block col-span-2 mb-2">
              <span class="text-foreground">Date From</span>
              <input
                type="datetime-local"
                class="form-input mt-1 block w-full"
                autocomplete="off"
                v-model="localState.range.from"
                placeholder="Select start date..."
              />
            </label>
            <label class="block col-span-2 mb-2">
              <span class="text-foreground">Date To</span>
              <input
                type="datetime-local"
                class="form-input mt-1 block w-full"
                autocomplete="off"
                v-model="localState.range.to"
                placeholder="Select end date..."
              />
            </label>
          </div>

          <hr />
          <button
            type="button"
            @click.prevent="setCustomRange()"
            class="m-2 -mb-4 w-full rounded-sm border border-primary bg-primary px-4 py-2 text-primary-foreground transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
          >
            Apply Filter
          </button>
        </form>
      </template>
    </beak-modal>
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>
