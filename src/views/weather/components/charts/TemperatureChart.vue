<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

// Store
import useWeatherStore from '@/store/weather/'

// helpers
import dayjs from 'dayjs'
import { xAxisGroups } from '@/utils/helpers'

// types
import type { Forecast } from '@/types/weather'

const weatherStore = useWeatherStore()
const { forecastDataList } = storeToRefs(weatherStore)

const getSeries = (list: Forecast[]) => {
  type Serie = {
    x: string
    y: number
  }
  const series: Serie[] = []
  list.forEach((item: Forecast) => {
    series.push({ x: dayjs(item.dt * 1000).format('H:mm'), y: Math.round(item.main.temp) })
  })
  return series
}

const series = computed(() => {
  if (forecastDataList.value) {
    return [
      {
        name: 'Temperature',
        data: getSeries(forecastDataList.value)
      }
    ]
  }
  return null
})
const options = computed(() => {
  if (forecastDataList.value) {
    return {
      chart: {
        type: 'bar',
        height: 400,
        id: 'temperature-chart'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '95%',
          endingShape: 'rounded'
        }
      },
      xaxis: {
        type: 'category',
        group: {
          groups: xAxisGroups(forecastDataList.value)
        }
      },
      yaxis: {
        title: {
          text: '°C'
        }
      }
    }
  }
  return null
})
</script>

<template>
  <VueApexCharts v-if="forecastDataList" :series="series" :options="options" height="400" />
</template>
