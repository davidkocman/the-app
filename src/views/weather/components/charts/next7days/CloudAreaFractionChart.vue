<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useCloudChartData from '@/composables/weather/chartData/useCloudChartData'

const { chartOptions } = useCloudChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
