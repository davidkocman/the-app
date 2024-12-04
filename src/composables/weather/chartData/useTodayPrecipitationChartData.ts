import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function usePrecipitationChartData() {
  const weatherStore = useWeatherStore()
  const { todaySeries } = storeToRefs(weatherStore)

  /**
   * It takes the todaySeries data and returns an array of strings that represent the hours of the day
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
   * It takes the todaySeries data and returns an array of precipitation amounts
   * @returns An array of numbers
   */
  function getPrecipitationAmount(): number[] {
    const precipitationAmount: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      if (item.data.next_6_hours) {
        precipitationAmount.push(item.data.next_6_hours.details.precipitation_amount)
      } else {
        precipitationAmount.push(item.data.instant.details.air_temperature)
      }
    })

    return precipitationAmount
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
        text: 'Amount of precipitation',
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
        title: {
          text: '(mm)',
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
          name: 'Precipitation',
          data: getPrecipitationAmount(),
          type: 'column',
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: 'mm'
          },
          dataGrouping: {
            enabled: false
          },
          color: 'var(--precipitation)'
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
