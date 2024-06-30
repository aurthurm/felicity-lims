<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const ChartLJ = defineAsyncComponent(
    () => import('@/components/analysis/quality/ChartLJ.vue')
  )

  const analyisAsSeries = [
    { date: new Date(2021, 1, 5).toDateString(), value: 3 },
    { date: new Date(2021, 1, 6).toDateString(), value: -19.5 },
    { date: new Date(2021, 1, 7).toDateString(), value: -22.1 },
    { date: new Date(2021, 1, 8).toDateString(), value: 0},
    { date: new Date(2021, 1, 9).toDateString(), value: -1.3 },
    { date: new Date(2021, 1, 10).toDateString(), value: 2.4 },
    { date: new Date(2021, 1, 11).toDateString(), value: -1.3 },
    { date: new Date(2021, 1, 12).toDateString(), value: 2.3 },
    { date: new Date(2021, 1, 13).toDateString(), value: 29.9},
    { date: new Date(2021, 1, 14).toDateString(), value: 2.1 },
    { date: new Date(2021, 1, 15).toDateString(), value: 1.4 },
    { date: new Date(2021, 1, 16).toDateString(), value: -1.2 },
    { date: new Date(2021, 1, 17).toDateString(), value: -6.4 },
  ]; 

</script>

<template>
  <div class="">
    1. rorice a drop down of the analytes within this QC Set
    2. Select Analyte to plot QC Charts 
    3. if data is numeric plot numeric chart else category chart
    <hr>
    <ChartLJ :series="analyisAsSeries" />
    <hr>
    <router-view />
  </div>
</template>
