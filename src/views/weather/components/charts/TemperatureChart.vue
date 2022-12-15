<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTempChartData from '@/composables/weather/chartData/useTempChartData'

const { chartOptions } = useTempChartData()
</script>

<template>
  <div class="col-12 col-lg-6">
    <Chart :options="chartOptions" />
  </div>
</template>
