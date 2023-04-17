import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useHumidityChartData() {
  const weatherStore = useWeatherStore()
  const { todaySeries } = storeToRefs(weatherStore)

  /**
   * It takes the todaySeries data and returns an array of hours
   * @returns An array of strings
   */
  function getHours() {
    const categories: string[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      categories.push(new Date(item.time).getHours().toString() + ':00')
    })

    return categories
  }

  /**
   * It takes the todaySeries object, loops through each item in the value array, and pushes the
   * relative humidity value to a new array
   * @returns An array of numbers
   */
  function getRelativeHumidity(): number[] {
    const relativeHumidity: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      relativeHumidity.push(item.data.instant.details.relative_humidity)
    })
    return relativeHumidity
  }

  const chartOptions = computed(() => {
    const options: HighchartsOptions = {
      chart: {
        backgroundColor: '',
        style: {
          fontFamily: 'Roboto'
        }
      },
      boost: {
        useGPUTranslations: true
      },
      title: {
        text: 'Relative humidity',
        style: {
          color: 'var(--title-text)'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<span style="font-size: 10px">{point.key}:00</span><br/>'
      },
      legend: {
        itemStyle: {
          color: 'var(--legend)',
          fontWeight: 'bold'
        },
        itemHoverStyle: {
          color: 'grey'
        }
      },
      xAxis: [
        {
          categories: getHours(),
          type: 'category',
          gridLineColor: 'var(--x-hours-gridline)',
          labels: {
            style: {
              color: 'var(--x-hours-labels)'
            }
          }
        }
      ],
      yAxis: {
        gridLineDashStyle: 'Dash',
        gridLineColor: 'var(--y-gridline)',
        ceiling: 100,
        title: {
          text: '(%)',
          style: {
            color: 'var(--y-title)'
          }
        },
        labels: {
          style: {
            color: 'var(--y-labels)'
          }
        }
      },
      series: [
        {
          name: 'Humidity',
          data: getRelativeHumidity(),
          type: 'column',
          marker: {
            enabled: false
          },
          dataGrouping: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' %'
          },
          color: 'var(--humidity)'
        }
      ],
      credits: {
        enabled: false
      }
    }

    return options
  })

  return { chartOptions }
}
