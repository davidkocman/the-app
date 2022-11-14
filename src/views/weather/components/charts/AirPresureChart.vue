<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { Chart } from 'highcharts-vue'
import { TimeSeries } from '@/types/weather'
import useAirPresureChartData from '@/composables/weather/chartData/useAirPresureChartData'
const props = defineProps({
  timeseries: {
    required: true,
    type: Object as PropType<TimeSeries[]>
  }
})

/**
 * 'timeseries' needs to be converted to reactive object, so I can use them inside composable function
 * - props is reactive object
 * - props.timeseries is a literal value (non-reactive)
 */
const { timeseries } = toRefs(props)

/**
 * composable function
 */
const { chartOptions } = useAirPresureChartData(timeseries)
</script>

<template>
  <div class="col-11 col-md-6">
    <Chart :options="chartOptions" />
  </div>
</template>
