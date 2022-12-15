<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useHumidityChartData from '@/composables/weather/chartData/useHumidityChartData'

const { chartOptions } = useHumidityChartData()
</script>

<template>
  <div class="col-12 col-lg-6">
    <Chart :options="chartOptions" />
  </div>
</template>
