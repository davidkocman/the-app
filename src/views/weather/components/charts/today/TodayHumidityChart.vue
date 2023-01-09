<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayHumidityChartData from '@/composables/weather/chartData/useTodayHumidityChartData'

const { chartOptions } = useTodayHumidityChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
