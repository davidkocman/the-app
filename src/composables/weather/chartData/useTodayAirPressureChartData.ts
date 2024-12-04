import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useTodayAirPressureChartData() {
  const weatherStore = useWeatherStore()
  const { todaySeries } = storeToRefs(weatherStore)

  /**
   * It takes the time property of each item in the todaySeries array and returns an array of hours
   * @returns An array of hours from the todaySeries data.
   */
  function getHours() {
    const categories: string[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      categories.push(new Date(item.time).getHours().toString() + ':00')
    })

    return categories
  }

  /**
   * It takes the `todaySeries` object, loops through each item in the `value` array, and pushes the
   * `air_pressure_at_sea_level` value into a new array
   * @returns An array of numbers
   */
  function getAirPresure(): number[] {
    const airPresure: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      airPresure.push(item.data.instant.details.air_pressure_at_sea_level)
    })
    return airPresure
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
        text: 'Atmospheric Pressure',
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
        plotLines: [
          {
            color: 'var(--y-gridline)',
            dashStyle: 'Solid',
            width: 1,
            value: 1013.25,
            zIndex: 4,
            label: {
              text: 'Standard pressure 1013.25 hPa',
              style: {
                color: 'var(--y-plotlines-label)'
              }
            }
          }
        ],
        title: {
          text: '(hPa)',
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
          name: 'Atmospheric Pressure',
          data: getAirPresure(),
          type: 'spline',
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' hPa'
          },
          dataGrouping: {
            enabled: false
          },
          zones: [
            {
              value: 1013.25,
              color: 'var(--air-pressure-low)'
            },
            {
              color: 'var(--air-pressure-high)'
            }
          ],
          color: 'var(--air-pressure-break)'
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