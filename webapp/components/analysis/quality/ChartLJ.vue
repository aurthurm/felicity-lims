<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Chart } from '@antv/g2';
import { jStat } from 'jstat';

const SERIES_LIMIT = 5;
const chartId = ref(`lj-chart-${Math.random().toString(36).substr(2, 9)}`);

interface ChartLJProps {
  title: string,
  series: {date: Date, value: number}[]
}

const { series } = defineProps<ChartLJProps>()
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

function westGardRule(dataset: any[], key: string): any {
  let values: number[] = [];
  dataset?.forEach(item => {
    if(typeof(item[key]) == "number") values.push(item[key])
  })

  const n: number = values.length;
  const mu: number = jStat.mean(values);
  const sd: number = jStat.stdev(values);
  const x_sds: number[] = [-4,-3,-2,-1,0,1,2,3,4].map(x => 
    Math.round((mu + (x * sd)) * 100) / 100
  );

  // Calculate control limits
  const controlLimits = {
    mean: mu,
    sd1: { upper: mu + sd, lower: mu - sd },
    sd2: { upper: mu + (2 * sd), lower: mu - (2 * sd) },
    sd3: { upper: mu + (3 * sd), lower: mu - (3 * sd) }
  };

  for(let [i, obs] of dataset.entries()) {
    const current = jStat.abs([obs[key]])[0];
    let prev_1, prev_2, prev_3;
    
    // Enhanced point metadata
    obs["color"] = COLORS.GOOD;
    obs["rule"] = null;
    obs["description"] = "";
    obs["deviation"] = Math.round(((current - mu) / sd) * 100) / 100;

    // 1_3s Rule
    if(Math.abs(obs[key] - mu) > 3 * sd) {
      obs["color"] = COLORS.ERROR;
      obs["rule"] = "1_3s";
      obs["description"] = RULE_DESCRIPTIONS["1_3s"];
      continue;
    }

    // Enhanced 1_2s Rule with more context
    if(Math.abs(obs[key] - mu) > 2 * sd) {
      obs["color"] = COLORS.WARNING;
      obs["rule"] = "1_2s";
      obs["description"] = RULE_DESCRIPTIONS["1_2s"];
      
      // 2_2s Rule check
      if(i > 0 && dataset[i-1]) {
        prev_1 = dataset[i-1][key];
        if(Math.abs(prev_1 - mu) > 2 * sd && 
           ((prev_1 > mu && obs[key] > mu) || (prev_1 < mu && obs[key] < mu))) {
          obs["color"] = COLORS.ERROR;
          obs["rule"] = "2_2s";
          obs["description"] = RULE_DESCRIPTIONS["2_2s"];
        }
      }
      continue;
    }

    // R_4s Rule with improved detection
    if(i > 0 && dataset[i-1]) {
      prev_1 = dataset[i-1][key];
      const diff = Math.abs(obs[key] - prev_1);
      if(diff >= 4 * sd) {
        obs["color"] = COLORS.ERROR;
        obs["rule"] = "R_4s";
        obs["description"] = RULE_DESCRIPTIONS["R_4s"];
        continue;
      }
    }

    // Enhanced 4_1s Rule
    if(i >= 3) {
      const prevValues = dataset.slice(i-3, i).map(d => d[key]);
      const currentValue = obs[key];
      
      const allAboveMean = [currentValue, ...prevValues].every(v => v > mu);
      const allBelowMean = [currentValue, ...prevValues].every(v => v < mu);
      const allOutside1SD = [currentValue, ...prevValues].every(v => 
        Math.abs(v - mu) > sd
      );

      if((allAboveMean || allBelowMean) && allOutside1SD) {
        obs["color"] = COLORS.ERROR;
        obs["rule"] = "4_1s";
        obs["description"] = RULE_DESCRIPTIONS["4_1s"];
        continue;
      }
    }

    // New: 10_x Rule implementation
    if(i >= 9) {
      const tenPoints = dataset.slice(i-9, i+1).map(d => d[key]);
      const allAboveMean = tenPoints.every(v => v > mu);
      const allBelowMean = tenPoints.every(v => v < mu);

      if(allAboveMean || allBelowMean) {
        obs["color"] = COLORS.ERROR;
        obs["rule"] = "10_x";
        obs["description"] = RULE_DESCRIPTIONS["10_x"];
      }
    }
  }

  return {
    rules: dataset,
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
  document.getElementById(chartId.value)!.innerHTML = '';
  const chart = new Chart({
    container: chartId.value,
    autoFit: true,
    height: 400,
    padding: [30, 40, 120, 60] // Increased bottom padding for slanted labels
  });

  const west_gard = westGardRule(series, 'value');
  chart.data(west_gard.rules);

  // Scales and tooltip configurations remain the same
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
    customItems: (originalItems: any) => {
      const item = originalItems[0];
      return [
        { name: 'Date', value: item.data.date },
        { name: 'Value', value: item.data.value.toFixed(2) },
        { name: 'Deviation', value: `${item.data.deviation}σ` },
        { name: 'Rule Violation', value: item.data.description || 'None' }
      ];
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
    text: {
      content: 'Mean',
      position: 'end',
      autoRotate: true,
      style: {
        fill: COLORS.MEAN_LINE,
      }
    }
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
  plotLevyJennings();
});


</script>

<template>
  <!-- Template remains the same -->
  <div class="w-full">
    <div class="mb-4">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
    </div>
    
    <div class="relative w-full min-h-[400px] border bg-white shadow-sm" v-if="!cannotPlot">
      <div :id="chartId" class="absolute inset-0"></div>
    </div>
    <div v-else>At least {{ SERIES_LIMIT }} data points are required to plot. Currently you have {{ series?.length }} for the selected period.</div>
  </div>
</template>