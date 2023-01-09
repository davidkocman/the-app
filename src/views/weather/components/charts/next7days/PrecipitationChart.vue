<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import usePrecipitationChartData from '@/composables/weather/chartData/usePrecipitationChartData'

const { chartOptions } = usePrecipitationChartData()
</script>

<template>
  <div class="col-12 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
