<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useAirPressureChartData from '@/composables/weather/chartData/useAirPressureChartData'

const { chartOptions } = useAirPressureChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
