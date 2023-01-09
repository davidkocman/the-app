<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayTempChartData from '@/composables/weather/chartData/useTodayTempChartData'

const { chartOptions } = useTodayTempChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
