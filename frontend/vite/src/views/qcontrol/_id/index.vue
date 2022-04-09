<script setup lang="ts">
  import { onMounted } from 'vue';
  import { Chart } from '@antv/g2';
  import { jStat } from 'jstat';

  const  ERROR = "#FF0000";
  const  WARNING = "#FEB900";
  const  GOOD = "#00FF00";

  function westGardRule(dataset: any[], key: string): any {
    let values: number[] = [];
    dataset?.forEach(item => {
      if(typeof(item[key]) == "number") values.push(item[key])
    })

    const n:number = values.length;
    const mu:number = jStat.mean(values)
    const sd:number = jStat.stdev(values)
    const x_sds:number[] = [-4,-3,-2,-1,0,1,2,3,4].map(x =>  Math.round((x * (mu + sd)) * 100) / 100);

    // adjust based on  x_sds
    const zero:number = 0
    const one_sd:number = Math.round((mu + sd) * 100) / 100
    const two_sd:number = Math.round(2 * (mu + sd) * 100) / 100
    const three_sd:number = Math.round(3 * (mu + sd) * 100) / 100
    const four_sd:number  = Math.round(4 * (mu + sd) * 100) / 100

    for(let [i, obs] of dataset.entries()) {
      const current = jStat.abs([obs[key]])[0]
      let prev_1, prev_2, prev_3;
      // defaults
      obs["color"] = GOOD
      obs["rule"] = null

      // 1_3s Rule:
      // 1 control result outside 3sd
        if(current > three_sd){
            obs["color"] = ERROR
            obs["rule"]  = "1_3s" 
            continue
        }

      // 1_2s Rule : Warning rule
      // one of two control results fall outside +- 2SD
      if(current > two_sd) {
        obs["color"] = WARNING
        obs["rule"]  = "1_2s"

        // 2_2s Rule:
        // two control results fall outside 2sd in the same direction
        // or both controls in the same run exceeded 2sd
        if(i > 1 && dataset[i-1]) {
            prev_1 = jStat.abs([dataset[i-1][key]])[0]
            if(prev_1 <= three_sd && prev_1 > two_sd) {
              obs["color"] = ERROR
              obs["rule"]  = "2_2s"
              continue
            }
        }
        continue
      }

      // R_4s  Rule:
      // Difference between two runs equals or exceeds 4sd	    
      if(i > 1 && dataset[i -1]){
        prev_1 = jStat.abs([dataset[i-1][key]])[0]
        let diff = jStat.abs([current - prev_1])[0]
        if(diff >= sd * 4){
          obs["color"] = ERROR
          obs["rule"]  = "R_4s"
          continue
        }
      }

      // 4_1s:
      // 4 consecutive controls outside 1sd 
      if(i > 3 && dataset[i - 3]){
        prev_1 = jStat.abs([dataset[i-1][key]])[0]
        prev_2 = jStat.abs([dataset[i-2][key]])[0]
        prev_3 = jStat.abs([dataset[i-3][key]])[0]

        if(current > one_sd && current <= two_sd &&
          prev_1 > one_sd && prev_1 <= two_sd &&
          prev_2 > one_sd && prev_2 <= two_sd &&
          prev_3 > one_sd && prev_3 <= two_sd){
            // on either side of the mean 
            // obs["color"] = ERROR
            // obs["rule"]  = "4_1s"

            // for one side of mead
            const x = [dataset[i][key],dataset[i-1][key],dataset[i-2][key],dataset[i-3][key]];
            const x_above = x.every(x => x > 0)
            const x_below = x.every(x => x < 0)

            if(x_above || x_below) {
              obs["color"] = ERROR
              obs["rule"]  = "4_1s"
            }

            // A correction to make sure that even if the fifth control lies in the same 
            // range it will not be regarded as a 4_1s.
            if (dataset[i-1]["rule"] == "4_1s"){
                obs["rule"]  = "!!!"
            }
            if (dataset[i-2]["rule"] == "4_1s"){
                obs["rule"]  = "!!!"
            }
            if (dataset[i-3]["rule"] == "4_1s"){
                obs["rule"]  = "!!!"
            }
            if (dataset[i-4]["rule"] == "4_1s"){
                obs["rule"]  = "!!!"
            }
            continue
        }
      }
      // 10_x Rule:
      // 10 consecutive control results are on the same sideof the mean
      // Not Done. Yu can create it and share with me
    }
    
    return {
      rules: dataset,
      stats: { n, mu, sd, x_sds },
    }
  }
  
  const data = [
    { date: new Date(2021, 1, 1).toDateString(), value: 1.2, rule: "1_2S" },
    { date: new Date(2021, 1, 2).toDateString(), value: 3.3, rule: "1_2S" },
    { date: new Date(2021, 1, 3).toDateString(), value: 2.1, rule: "2_2S" },
    { date: new Date(2021, 1, 4).toDateString(), value: 0.2, rule: "1_2S" },
    { date: new Date(2021, 1, 5).toDateString(), value: 3, rule: "1_2S" },
    { date: new Date(2021, 1, 6).toDateString(), value: -3, rule: "1_2S" },
    { date: new Date(2021, 1, 7).toDateString(), value: -1.2, rule: "1_2S" },
    { date: new Date(2021, 1, 8).toDateString(), value: 0, rule: "2_2S" },
    { date: new Date(2021, 1, 9).toDateString(), value: -1.3, rule: "1_2S" },
    { date: new Date(2021, 1, 10).toDateString(), value: 2.4, rule: "1_2S" },
    { date: new Date(2021, 1, 11).toDateString(), value: -1.3, rule: "1_2S" },
    { date: new Date(2021, 1, 12).toDateString(), value: 2.3, rule: "1_2S" },
    { date: new Date(2021, 1, 13).toDateString(), value: 1.9, rule: "2_2S" },
    { date: new Date(2021, 1, 14).toDateString(), value: 2.1, rule: "1_2S" },
    { date: new Date(2021, 1, 15).toDateString(), value: 1.4, rule: "1_2S" },
    { date: new Date(2021, 1, 16).toDateString(), value: -1.2, rule: "1_2S" },
    { date: new Date(2021, 1, 17).toDateString(), value: -6.4, rule: "1_2S" },
    { date: new Date(2021, 1, 18).toDateString(), value: 6.2, rule: "1_2S" },
    { date: new Date(2021, 1, 19).toDateString(), value: -6.5, rule: "1_2S" },
    { date: new Date(2021, 1, 20).toDateString(), value: -6.4, rule: "2_2S" },
    { date: new Date(2021, 1, 21).toDateString(), value: -2.8, rule: "1_2S" },
    { date: new Date(2021, 1, 22).toDateString(), value: 1.3, rule: "1_2S" },
    { date: new Date(2021, 1, 23).toDateString(), value: -1.5, rule: "1_2S" },
    { date: new Date(2021, 1, 24).toDateString(), value: 5.5, rule: "1_2S" },
    { date: new Date(2021, 1, 25).toDateString(), value: 5.7, rule: "1_2S" },
    { date: new Date(2021, 1, 26).toDateString(), value: 5.4, rule: "1_2S" },
    { date: new Date(2021, 1, 27).toDateString(), value: 5.6, rule: "1_2S" },
    { date: new Date(2021, 1, 28).toDateString(), value: 5.3, rule: "1_2S" },
    { date: new Date(2021, 1, 29).toDateString(), value: 4.5, rule: "1_2S" },
    { date: new Date(2021, 1, 30).toDateString(), value: 4.2, rule: "1_2S" },
  ]; 

  onMounted(() => {

    const chart = new Chart({
      container: 'felicity-chart',
      autoFit: true,
      height: 250,
    });

    const west_gard = westGardRule(data, 'value');
    chart.data(west_gard.rules);

    chart.scale({
        date: {
          range: [0, 1],
        },
        value: {
          ticks: west_gard.stats.x_sds,
          nice: true,
          alias: 'Value',
        },
      });
      chart.tooltip({
        showTitle: true,
        showCrosshairs: true,
      });
      chart.line().position('date*value').label('value');
      chart.point()
            .position('date*value')
            .color('value*color*rule', (v,c,r) => {
              return typeof(c) === 'string' ? c : ""
            });

      chart.legend('rule' ,{
        position: 'bottom',
      });

      chart.render();

  })
</script>

<template>
  <div class="">
    Select Analyte to plot QC Charts if data is numeric
    Will prorice a drop down of the analytes within this QC Set
    <hr>
    <div id="felicity-chart"></div>
    <hr>
    <router-view />
  </div>
</template>
