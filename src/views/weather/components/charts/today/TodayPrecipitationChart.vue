<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import useTodayPrecipitationChartData from '@/composables/weather/chartData/useTodayPrecipitationChartData'

const { chartOptions } = useTodayPrecipitationChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
