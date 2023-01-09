<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayAirPressureChartData from '@/composables/weather/chartData/useTodayAirPressureChartData'

const { chartOptions } = useTodayAirPressureChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
