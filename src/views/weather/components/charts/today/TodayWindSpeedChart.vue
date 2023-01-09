<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayWindSpeedChartData from '@/composables/weather/chartData/useTodayWindSpeedChartData'

const { chartOptions } = useTodayWindSpeedChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
