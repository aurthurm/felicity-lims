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

const toggleFilters = (): void => {
  dashBoardStore.setShowFilters(!dashboard.value.showFilters);
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
    <section class="mb-8">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Resource Filters
        </h2>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
          @click="toggleFilters"
        >
          <span>{{ dashboard.showFilters ? "Hide Filters" : "Show Filters" }}</span>
          <svg
            class="h-3.5 w-3.5 transition-transform duration-300"
            :class="{ 'rotate-180': dashboard.showFilters }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <Transition name="filters-slide">
        <div
          v-if="dashboard.showFilters"
          class="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/60 p-3"
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
                'rounded-sm border px-2 py-1 text-foreground transition duration-300 focus:outline-none',
                dashboard.currentFilter === filter
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-foreground hover:bg-primary hover:text-primary-foreground',
              ]"
            >
              {{ filter }}
            </button>
            <template #popper>{{ dashBoardStore.filterToolTip(filter) }}</template>
          </VTooltip>

          <button
            @click="showModal = true"
            class="ml-auto rounded-sm border border-border px-2 py-1 text-muted-foreground transition duration-300 hover:bg-muted hover:text-primary-foreground focus:outline-none"
          >
            {{ dashboard.filterRange.from }} - {{ dashboard.filterRange.to }}
          </button>
        </div>
      </Transition>
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
.filters-slide-enter-active,
.filters-slide-leave-active {
  transition: all 0.28s ease;
  transform-origin: top;
}

.filters-slide-enter-from,
.filters-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.96);
}
</style>
