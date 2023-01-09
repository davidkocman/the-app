<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useWindSpeedChartData from '@/composables/weather/chartData/useWindSpeedChartData'

const { chartOptions } = useWindSpeedChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
