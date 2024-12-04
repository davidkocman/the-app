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

const getVolumeData = (list: Forecast[]) => {
  type Serie = {
    x: string
    y: number
  }
  const series: Serie[] = []
  list.forEach((item: Forecast) => {
    series.push({
      x: dayjs(item.dt * 1000).format('H:mm'),
      y: item.rain && item.rain['3h'] ? Math.round(item.rain['3h']) : 0
    })
  })
  return series
}

const getChanceData = (list: Forecast[]) => {
  type Serie = {
    x: string
    y: number
  }
  const series: Serie[] = []
  list.forEach((item: Forecast) => {
    series.push({
      x: dayjs(item.dt * 1000).format('H:mm'),
      y: Math.round(item.pop * 100)
    })
  })
  return series
}

const series = computed(() => {
  if (forecastDataList.value) {
    return [
      {
        name: 'Chance of rain',
        type: 'area',
        data: getChanceData(forecastDataList.value)
      },
      {
        name: 'Rain volume',
        type: 'bar',
        data: getVolumeData(forecastDataList.value)
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
        text: 'Rainfall forecast',
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
      colors: ['rgba(0,0,0,0.15)', '#2980b9'],
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
      yaxis: [
        {
          max: 100,
          seriesName: 'Chance of rain',
          title: {
            text: '%',
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
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: appStore.isDarkMode ? '#a8a8a8' : '#616161',
            height: 1,
            offsetX: -1,
            offsetY: 0
          }
        },
        {
          opposite: true,
          seriesName: 'Rain volume',
          title: {
            text: 'mm',
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
        }
      ],
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
          colors: ['#95a5a6', '#82ccdd']
        }
      },
      tooltip: {
        theme: appStore.isDarkMode ? 'dark' : 'light',
        custom: ({ series, dataPointIndex }) => {
          return `<div class="q-pa-sm">
            <h4 class="text-caption">Chance: <span class="text-weight-bold">${series[0][dataPointIndex]}</span>%</h4>
            <h4 class="text-caption">Volume: <span class="text-weight-bold">${series[1][dataPointIndex]}</span> mm</h4>
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
