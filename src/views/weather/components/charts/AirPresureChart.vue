<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useAirPresureChartData from '@/composables/weather/chartData/useAirPresureChartData'

const { chartOptions } = useAirPresureChartData()
</script>

<template>
  <div class="col-12 col-lg-6">
    <Chart :options="chartOptions" />
  </div>
</template>
