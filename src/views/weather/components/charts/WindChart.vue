<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

// Store
import useWeatherStore from '@/store/weather/'
import useAppStore from '@/store/app/'

// helpers
import dayjs from 'dayjs'
import { xAxisGroups } from '@/utils/helpers'

// types
import type { Forecast } from '@/types/weather'

const weatherStore = useWeatherStore()
const appStore = useAppStore()
const { forecastDataList } = storeToRefs(weatherStore)

const getSeriesData = (list: Forecast[]) => {
  type Serie = {
    x: string
    y: number
    goals: Array<{
      name: string
      value: number
      strokeColor: string
    }>
  }
  const series: Serie[] = []
  list.forEach((item: Forecast) => {
    series.push({
      x: dayjs(item.dt * 1000).format('H:mm'),
      y: Math.round(item.wind.speed * 3.6),
      goals: [
        {
          name: 'Wind gusts:',
          value: Math.round(item.wind.gust * 3.6),
          strokeColor: appStore.isDarkMode ? '#e74c3c' : '#e74c3c'
        }
      ]
    })
  })
  return series
}

const series = computed(() => {
  if (forecastDataList.value) {
    return [
      {
        name: 'Wind speed',
        data: getSeriesData(forecastDataList.value)
      }
    ]
  }
  return null
})
const options = computed(() => {
  if (forecastDataList.value) {
    return {
      annotations: {
        yaxis: [
          {
            y: 0
          }
        ]
      },
      title: {
        text: 'Wind speed forecast',
        align: 'center',
        style: {
          fontSize: '14px',
          fontWeight: 'regular',
          color: appStore.isDarkMode ? 'rgba(255, 255, 255, .85)' : '#213547'
        }
      },
      chart: {
        type: 'bar',
        height: 400,
        id: 'wind-chart',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '95%',
          dataLabels: {
            position: 'top' // top, center, bottom
          }
        }
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '12px',
            colors: appStore.isDarkMode ? 'rgba(255, 255, 255, .85)' : '#213547'
          }
        },
        axisBorder: {
          show: true,
          color: appStore.isDarkMode ? '#a8a8a8' : '#616161',
          height: 1,
          width: '100%',
          offsetX: 0,
          offsetY: -1
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: appStore.isDarkMode ? '#a8a8a8' : '#616161',
          height: 5,
          offsetX: 0,
          offsetY: 0
        },
        group: {
          groups: xAxisGroups(forecastDataList.value),
          style: {
            colors: appStore.isDarkMode ? '#a8a8a8' : '#616161',
            fontSize: '12px',
            fontWeight: 400
          }
        }
      },
      yaxis: {
        title: {
          text: 'km/h',
          style: {
            color: appStore.isDarkMode ? 'rgba(255, 255, 255, .85)' : '#213547'
          }
        },
        labels: {
          style: {
            fontSize: '12px',
            colors: appStore.isDarkMode ? 'rgba(255, 255, 255, .85)' : '#213547'
          }
        },
        axisBorder: {
          show: true,
          color: appStore.isDarkMode ? '#a8a8a8' : '#616161',
          height: 1,
          offsetX: -1,
          offsetY: 0
        }
      },
      grid: {
        show: false,
        borderColor: '#90A4AE',
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      dataLabels: {
        style: {
          colors: ['#27ae60']
        }
      },
      fill: {
        type: 'gradient',
        colors: ['#27ae60'],
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.2,
          type: 'vertical',
          opacityTo: 0.8,
          stops: [0, 50, 100]
        }
      },
      tooltip: {
        theme: appStore.isDarkMode ? 'dark' : 'light',
        custom: ({ series, seriesIndex, dataPointIndex, w }: { series: number[][], seriesIndex: number, dataPointIndex: number, w: any }) => {
          return `<div class="q-pa-sm">
            <h4 class="text-caption">Gusts: <span class="text-weight-bold">${w.config.series[0].data[dataPointIndex].goals[0].value}</span> km/h</h4>
            <h4 class="text-caption">Speed: <span class="text-weight-bold">${series[seriesIndex][dataPointIndex]}</span> km/h</h4>
            </div>`
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
