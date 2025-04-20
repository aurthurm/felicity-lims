<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Chart } from '@antv/g2';
import { jStat } from 'jstat';

const SERIES_LIMIT = 5;
const chartId = ref(`lj-chart-${Math.random().toString(36).substr(2, 9)}`);

interface ChartLJProps {
  title: string;
  series: Array<{
    date: Date;
    value: number;
  }>;
}

interface ControlLimits {
  mean: number;
  sd1: { upper: number; lower: number };
  sd2: { upper: number; lower: number };
  sd3: { upper: number; lower: number };
}

interface ChartStats {
  n: number;
  mu: number;
  sd: number;
  x_sds: number[];
  controlLimits: ControlLimits;
}

interface DataPoint {
  date: Date;
  value: number;
  color: string;
  rule: string | null;
  description: string;
  deviation: number;
}

interface TooltipItem {
  data: any;
  mappingData: any;
  color: string;
  marker: any;
  name: string;
  value: any;
}

interface WestGardResult {
  rules: DataPoint[];
  stats: ChartStats;
}

const { series } = defineProps<ChartLJProps>();
const cannotPlot = computed(() => {
  return !series || series.length < SERIES_LIMIT;
});

// Enhanced color scheme with better accessibility
const COLORS = {
  ERROR: "#dc2626",    // Red with better contrast
  WARNING: "#f59e0b",  // Amber for warnings
  GOOD: "#22c55e",     // Green that's easier to see
  MEAN_LINE: "#3b82f6" // Blue for mean line
};

// Improved rule descriptions for tooltips
const RULE_DESCRIPTIONS = {
  "1_3s": "1-3s: One control result outside ±3SD",
  "1_2s": "1-2s: One control result outside ±2SD (Warning)",
  "2_2s": "2-2s: Two consecutive controls outside ±2SD",
  "R_4s": "R-4s: Difference between consecutive runs ≥4SD",
  "4_1s": "4-1s: Four consecutive controls outside ±1SD on same side",
  "10_x": "10-x: Ten consecutive controls on same side of mean"
};

function westGardRule(dataset: Array<{date: Date; value: number}>, key: 'value'): WestGardResult {
  let values: number[] = [];
  dataset?.forEach(item => {
    if(typeof(item[key]) === "number") values.push(item[key]);
  });

  const n: number = values.length;
  const mu: number = jStat.mean(values);
  const sd: number = jStat.stdev(values);
  const x_sds: number[] = [-4,-3,-2,-1,0,1,2,3,4].map(x => 
    Math.round((mu + (x * sd)) * 100) / 100
  );

  // Calculate control limits
  const controlLimits: ControlLimits = {
    mean: mu,
    sd1: { upper: mu + sd, lower: mu - sd },
    sd2: { upper: mu + (2 * sd), lower: mu - (2 * sd) },
    sd3: { upper: mu + (3 * sd), lower: mu - (3 * sd) }
  };

  const rules: DataPoint[] = dataset.map(obs => {
    const current = jStat.abs([obs[key]])[0];
    const point: DataPoint = {
      ...obs,
      color: COLORS.GOOD,
      rule: null,
      description: "",
      deviation: Math.round(((current - mu) / sd) * 100) / 100
    };

    // 1_3s Rule
    if(Math.abs(obs[key] - mu) > 3 * sd) {
      point.color = COLORS.ERROR;
      point.rule = "1_3s";
      point.description = RULE_DESCRIPTIONS["1_3s"];
      return point;
    }

    // Enhanced 1_2s Rule with more context
    if(Math.abs(obs[key] - mu) > 2 * sd) {
      point.color = COLORS.WARNING;
      point.rule = "1_2s";
      point.description = RULE_DESCRIPTIONS["1_2s"];
      return point;
    }

    // R_4s Rule with improved detection
    if(dataset.indexOf(obs) > 0) {
      const prev_1 = dataset[dataset.indexOf(obs) - 1][key];
      const diff = Math.abs(obs[key] - prev_1);
      if(diff >= 4 * sd) {
        point.color = COLORS.ERROR;
        point.rule = "R_4s";
        point.description = RULE_DESCRIPTIONS["R_4s"];
        return point;
      }
    }

    // Enhanced 4_1s Rule
    if(dataset.indexOf(obs) >= 3) {
      const prevValues = dataset.slice(dataset.indexOf(obs)-3, dataset.indexOf(obs)).map(d => d[key]);
      const currentValue = obs[key];
      
      const allAboveMean = [currentValue, ...prevValues].every(v => v > mu);
      const allBelowMean = [currentValue, ...prevValues].every(v => v < mu);
      const allOutside1SD = [currentValue, ...prevValues].every(v => 
        Math.abs(v - mu) > sd
      );

      if((allAboveMean || allBelowMean) && allOutside1SD) {
        point.color = COLORS.ERROR;
        point.rule = "4_1s";
        point.description = RULE_DESCRIPTIONS["4_1s"];
        return point;
      }
    }

    // New: 10_x Rule implementation
    if(dataset.indexOf(obs) >= 9) {
      const tenPoints = dataset.slice(dataset.indexOf(obs)-9, dataset.indexOf(obs)+1).map(d => d[key]);
      const allAboveMean = tenPoints.every(v => v > mu);
      const allBelowMean = tenPoints.every(v => v < mu);

      if(allAboveMean || allBelowMean) {
        point.color = COLORS.ERROR;
        point.rule = "10_x";
        point.description = RULE_DESCRIPTIONS["10_x"];
      }
    }

    return point;
  });

  return {
    rules,
    stats: { 
      n, 
      mu, 
      sd, 
      x_sds,
      controlLimits 
    }
  };
}

const plotLevyJennings = () => {
  const chartContainer = document.getElementById(chartId.value);
  if (!chartContainer) return;
  
  chartContainer.innerHTML = '';
  const chart = new Chart({
    container: chartId.value,
    autoFit: true,
    height: 400,
    padding: [30, 40, 120, 60]
  });

  const west_gard = westGardRule(series, 'value');
  chart.data(west_gard.rules);

  chart.scale({
    date: {
      range: [0, 1],
      tickCount: Math.min(10, series.length),
    },
    value: {
      ticks: west_gard.stats.x_sds,
      nice: true,
      alias: 'Standard Deviations',
    },
  });

  chart.tooltip({
    showTitle: true,
    showCrosshairs: true,
    customItems: (originalItems: TooltipItem[]) => {
      const item = originalItems[0];
      return [{
        ...item,
        name: 'Date',
        value: item.data.date,
        data: item.data,
        mappingData: item.mappingData,
        color: item.color,
        marker: item.marker
      }, {
        ...item,
        name: 'Value',
        value: item.data.value.toFixed(2),
        data: item.data,
        mappingData: item.mappingData,
        color: item.color,
        marker: item.marker
      }, {
        ...item,
        name: 'Deviation',
        value: `${item.data.deviation}σ`,
        data: item.data,
        mappingData: item.mappingData,
        color: item.color,
        marker: item.marker
      }, {
        ...item,
        name: 'Rule Violation',
        value: item.data.description || 'None',
        data: item.data,
        mappingData: item.mappingData,
        color: item.color,
        marker: item.marker
      }];
    }
  });

  // Fixed mean line annotation
  chart.annotation().line({
    start: ['min', west_gard.stats.mu],
    end: ['max', west_gard.stats.mu],
    style: {
      stroke: COLORS.MEAN_LINE,
      lineDash: [4, 4],
    },
  });

  // Fixed control limit lines
  [-3, -2, -1, 1, 2, 3].forEach(multiple => {
    const value = west_gard.stats.mu + (multiple * west_gard.stats.sd);
    chart.annotation().line({
      start: ['min', value],
      end: ['max', value],
      style: {
        stroke: multiple === 3 || multiple === -3 ? COLORS.ERROR : 
               multiple === 2 || multiple === -2 ? COLORS.WARNING : '#ddd',
        lineDash: [2, 2],
        opacity: 0.5
      },
      text: {
        content: `${multiple}σ`,
        position: 'end',
        autoRotate: true,
        style: {
          fill: multiple === 3 || multiple === -3 ? COLORS.ERROR : 
                multiple === 2 || multiple === -2 ? COLORS.WARNING : '#666',
        }
      }
    });
  });

  // Line and point configurations remain the same
  chart.line()
    .position('date*value')
    .tooltip('date*value*deviation*description')
    .style({
      stroke: '#666',
      lineWidth: 1
    });

  chart.point()
    .position('date*value')
    .color('color')
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 1
    })
    .size(6);

  // Configure axis with slanted labels
  chart.axis('date', {
    label: {
      autoRotate: true,
      rotate: 45, // Slant the labels 45 degrees
      offset: 20, // Add some spacing
      style: {
        textAlign: 'left',
        textBaseline: 'middle'
      }
    },
    tickLine: {
      alignTick: true,
    },
  });

  chart.legend({
    position: 'bottom',
    flipPage: false,
    itemMarginBottom: 8
  });

  chart.render();
};

onMounted(() => {
  if (!cannotPlot.value) {
    plotLevyJennings();
  }
});
</script>

<template>
  <div class="w-full bg-card rounded-lg border border-border p-4" role="region" aria-label="Levy-Jennings chart">
    <div v-if="cannotPlot" class="text-center py-8 text-muted-foreground">
      <p>Insufficient data points for Levy-Jennings chart.</p>
      <p class="text-sm">Minimum {{ SERIES_LIMIT }} points required.</p>
    </div>
    <div v-else :id="chartId" class="w-full h-[400px]" role="img" aria-label="Quality control chart"></div>
  </div>
</template>