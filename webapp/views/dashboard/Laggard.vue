<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, watch, ref } from "vue";
import { Chart } from "@antv/g2";
import { useDashBoardStore } from "@/stores/dashboard";

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);

const totalIncompleteDAI = ref(0);
const totalIncompleteAAD = ref(0);

onMounted(() => {
  dashBoardStore.getSampleLaggards();
});

watch(
  () => dashboard.value.laggards,
  (laggards, prev) => {
    const dai = laggards?.filter(
      (laggard) => laggard?.category === "delayed_and_incomplete"
    )[0];
    const aad = laggards?.filter(
      (laggard) => laggard?.category === "authorised_already_delayed"
    )[0];

    // Already Delayed
    totalIncompleteDAI.value = dai?.counts?.totalIncomplete ?? 0;
    const donutData = [
      {
        item: "On-Time",
        count: dai?.counts?.totalDelayed,
        percent:
          dai?.counts?.totalIncomplete > 0
            ? (dai?.counts?.totalDelayed / dai?.counts?.totalIncomplete) * 100
            : 0,
      },
      {
        item: "Delayed",
        count: dai?.counts?.totalNotDelayed,
        percent:
          dai?.counts?.totalIncomplete > 0
            ? (dai?.counts?.totalNotDelayed / dai?.counts?.totalIncomplete) * 100
            : 0,
      },
    ];
    plotLateDonut(donutData, "late-active-donut");

    const sinceData = [
      { type: "<10", value: dai?.counts?.lessThanTen },
      { type: "10 - 20", value: dai?.counts?.tenToTwenty },
      { type: "20 - 30", value: dai?.counts?.twentyToThirty },
      { type: "> 30", value: dai?.counts?.graterThanThirty },
    ];
    plotLateSince(
      sinceData,
      "late-active-since",
      "days since created",
      "number of samples"
    );

    // Authorised already delayed
    totalIncompleteAAD.value = aad?.counts?.totalIncomplete ?? 0;
    const donutData2 = [
      {
        item: "On-Time",
        count: aad?.counts?.totalDelayed,
        percent:
          aad?.counts?.totalIncomplete > 0
            ? (aad?.counts?.totalDelayed / aad?.counts?.totalIncomplete) * 100
            : 0,
      },
      {
        item: "Delayed",
        count: aad?.counts?.totalNotDelayed,
        percent:
          aad?.counts?.totalIncomplete > 0
            ? (aad?.counts?.totalNotDelayed / aad?.counts?.totalIncomplete) * 100
            : 0,
      },
    ];
    plotLateDonut(donutData2, "late-auth-donut");
    const sinceData2 = [
      { type: "<10", value: aad?.counts?.lessThanTen },
      { type: "10 - 20", value: aad?.counts?.tenToTwenty },
      { type: "20 - 30", value: aad?.counts?.twentyToThirty },
      { type: "> 30", value: aad?.counts?.graterThanThirty },
    ];
    plotLateSince(
      sinceData2,
      "late-auth-since",
      "days: created to authorised",
      "number of samples"
    );
  }
);

const plotLateSince = (data: any, elem: string, xAlias: string, yAlias: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 200,
    width: 600,
  });

  chart.options({
    type: 'interval',
    data: data,
    coordinate: { transform: [{ type: 'transpose' }] },
    encode: { x: 'type', y: 'value', size: 26 },
    scale: {
      value: { domain: [0, 150] },
    },
    axis: {
      x: {
        title: xAlias,
        titleFontSize: 12,
        titleFontWeight: 300,
        titleSpacing: 60,
        line: false,
        tickLine: false,
      },
      y: {
        title: yAlias,
        titleFontSize: 12,
        titleFontWeight: 300,
        titleSpacing: 30,
        label: false,
      },
    },
    legend: false,
    labels: [
      {
        text: 'value',
        position: 'right',
        dx: 10,
        style: { fill: 'hsl(var(--muted-foreground))' },
      },
    ],
    interaction: { elementHighlight: true },
  });

  chart.render();
};

const plotLateDonut = (data: any, elem: string) => {
  const chart = new Chart({
    container: elem,
    autoFit: true,
    height: 150,
    width: 300,
  });

  chart.options({
    type: 'interval',
    data: data,
    coordinate: { type: 'theta', innerRadius: 0.6, outerRadius: 0.75 },
    encode: { y: 'percent', color: 'item' },
    transform: [{ type: 'stackY' }],
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
    labels: [
      {
        text: (d: any) => `${d.item}: ${(d.percent * 100).toFixed(2)}%`,
      },
    ],
    interaction: { elementHighlight: true },
  });

  chart.render();
};

const resetLateActive = () => {
  const lateActive = document.getElementById("late-active");
  if (lateActive) {
    lateActive.innerHTML = `
      <div class="mx-8">
        <div id="late-active-donut"></div>
      </div>
      <div>
        <div id="late-active-since"></div>
      </div>
    `;
  }
};

const resetLateAuth = () => {
  const lateAuth = document.getElementById("late-auth");
  if (lateAuth) {
    lateAuth.innerHTML = `
      <div class="mx-8">
        <div id="late-auth-donut"></div>
      </div>
      <div>
        <div id="late-auth-since"></div>
      </div>
    `;
  }
};
</script>

<template>
  <div class="mt-4">
    <div v-if="dashboard.fetchingLaggards" class="text-start my-4">
      <fel-loader message="Fetching laggard stats..." />
    </div>

    <section>
      <h1 class="text-xl text-foreground font-semibold">Delayed and incomplete</h1>
      <hr class="my-2" />
      <div class="flex justify-start items-center">
        <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
          <div class="font-bold text-foreground text-2xl">{{ totalIncompleteDAI }}</div>
          <div class="font-semibold text-muted-foreground">Already Delayed</div>
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
    </section>

    <section class="mt-8">
      <h1 class="text-xl text-foreground font-semibold">Authorised already delayed</h1>
      <hr class="my-2" />
      <div class="flex justify-start items-center">
        <div class="bg-background shadow rounded-sm px-6 pt-3 pb-5 border border-foreground text-center">
          <div class="font-bold text-foreground text-2xl">{{ totalIncompleteAAD }}</div>
          <div class="font-semibold text-muted-foreground">Authorised Already Delayed</div>
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
    </section>
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>
