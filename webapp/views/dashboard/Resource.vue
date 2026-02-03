<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, watch, ref, nextTick } from "vue";
import { Chart } from "@antv/g2";
import dayjs from "dayjs";
import { CalendarDate } from "@internationalized/date";
import { useDashBoardStore } from "@/stores/dashboard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { Button } from "@/components/ui/button";

defineOptions({ name: 'ResourceView' })
// Initialize store
const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

// Popover open state for date range picker
const dateRangeOpen = ref(false);
// Date range for RangeCalendar (reka-ui DateRange: start/end as CalendarDate)
const dateRange = ref<{ start?: CalendarDate; end?: CalendarDate }>({});
// Minimum selectable date (year dropdown and calendar) – 2025
const minCalendarDate = new CalendarDate(2025, 1, 1);
// Maximum selectable date – last day of current year
const maxCalendarDate = computed(() => new CalendarDate(dayjs().year(), 12, 31));

// Sync dateRange from store when popover opens (so calendar shows current filter)
watch(dateRangeOpen, (open) => {
  if (open) {
    const from = dashboard.value.filterRange.fromIso;
    const to = dashboard.value.filterRange.toIso;
    if (from && to) {
      const dFrom = dayjs(from);
      const dTo = dayjs(to);
      dateRange.value = {
        start: new CalendarDate(dFrom.year(), dFrom.month() + 1, dFrom.date()),
        end: new CalendarDate(dTo.year(), dTo.month() + 1, dTo.date()),
      };
    } else {
      const today = dayjs();
      dateRange.value = {
        start: new CalendarDate(today.year(), today.month() + 1, today.date()),
        end: new CalendarDate(today.year(), today.month() + 1, today.date()),
      };
    }
  }
});

function applyDateRange() {
  const start = dateRange.value.start;
  const end = dateRange.value.end;
  if (start && end) {
    const from = dayjs(new Date(start.year, start.month - 1, start.day)).startOf("day");
    const to = dayjs(new Date(end.year, end.month - 1, end.day)).endOf("day");
    dashBoardStore.setFilterRange(from, to);
  }
  dateRangeOpen.value = false;
}

// Computed so the button label updates when store filterRange changes
const dateRangeButtonLabel = computed(
  () => `${dashboard.value.filterRange.from} – ${dashboard.value.filterRange.to}`
);

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
  async (samples) => {
    if (!samples?.length) return;
    await nextTick();
    samples.forEach((group) => {
      try {
        interface UserData {
          item: string;
          count: number;
          percent: number;
        }
        const users: UserData[] = [];
        const total = group.counts?.reduce((sum: number, sample: any) => sum + sample.count, 0) || 0;

        group.counts?.forEach((count: any) => {
          const itemName = count?.group != null ? String(count.group) : null;
          if (itemName == null) return;
          const cnt = Number(count?.count) || 0;
          users.push({
            item: itemName,
            count: cnt,
            percent: total > 0 ? cnt / total : 0,
          });
        });

        const validUsers = users.filter((u) => u.item != null && u.item !== "");
        if (validUsers.length === 0) return;
        plotUserMatrix(validUsers, group.group, group.group);
      } catch (err) {
        console.warn("[ResourceView] Failed to plot user matrix for", group.group, err);
      }
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

// Explicit palette so G2 never receives null in color/gradient (avoids toRGB null error)
const USER_MATRIX_PALETTE = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
  "#fa8c16",
];

const plotUserMatrix = (data: any[], elem: string, _grpName: string) => {
  const container = document.getElementById(elem);
  if (!container) return;
  container.innerHTML = "";

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
    formatter: (val: number) => `${(val * 100).toFixed(2)}%`,
  });

  chart.scale("item", {
    range: USER_MATRIX_PALETTE,
  });

  chart.legend(false);
  chart
    .interval()
    .adjust("stack")
    .position("percent")
    .color("item")
    .label("percent", {
      layout: [{ type: "pie-spider" }, { type: "hide-overlap" }],
      offset: 8,
      labelHeight: 38,
      content: (obj: any) => `${obj.item} (${obj.count})`,
      labelLine: {
        style: {
          lineWidth: 0.5,
        },
      },
    });

  chart.interaction("element-active");
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
        <Tooltip
          v-for="(filter, index) in dashboard.filters"
          :key="index"
        >
          <TooltipTrigger as-child>
            <button
              v-show="filter !== dashboard.filters[dashboard.filters.length]"
              @click="dashBoardStore.setCurrentFilter(filter)"
              type="button"
              :class="[
                'px-2 py-1 mr-2 border border-foreground text-foreground rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none',
                { 'bg-primary text-primary-foreground': dashboard.currentFilter === filter },
              ]"
            >
              {{ filter }}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" align="start">
            {{ dashBoardStore.filterToolTip(filter) }}
          </TooltipContent>
        </Tooltip>

        <Popover v-model:open="dateRangeOpen">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              class="ml-4 mr-1 min-w-[180px] justify-center border-border text-muted-foreground rounded-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {{ dateRangeButtonLabel }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="end">
            <RangeCalendar v-model="dateRange" :min-value="minCalendarDate" :max-value="maxCalendarDate" class="rounded-md border-0" />
            <div class="border-t p-3">
              <Button class="w-full" @click="applyDateRange">
                Apply range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="dashboard.fetchingResourceStats" class="text-start my-4">
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Fetching resource stats...</span>
      </span>
    </div>

    <!-- Content Section -->
    <section>
      <!-- Instrument Matrix -->
      <div class="mb-8">
        <h1 class="text-xl text-foreground font-semibold">Instrument Matrix / Load</h1>
        <hr class="my-2" />
        <Empty v-if="!dashboard.resourceStats?.instruments?.length" class="border-0 bg-transparent p-0 text-left">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No instrument data</EmptyTitle>
              <EmptyDescription>No instrument metrics available for this range.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
        <div v-else class="flex justify-start">
          <div
            v-for="instr in dashboard.resourceStats?.instruments"
            :key="instr.group"
            class="flex items-center bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground mr-8"
          >
            <span class="mr-4 font-bold text-foreground text-xl">
              {{ instrumentPerf(instr?.count) }}
            </span>
            <span class="font-semibold text-muted-foreground text-l">{{ instr.group }}</span>
          </div>
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

  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>
