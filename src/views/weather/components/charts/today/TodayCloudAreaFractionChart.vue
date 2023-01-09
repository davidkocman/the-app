<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayCloudChartData from '@/composables/weather/chartData/useTodayCloudChartData'

const { chartOptions } = useTodayCloudChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
