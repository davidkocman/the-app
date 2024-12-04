import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useCloudChartData() {
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
   * It takes the cloud area fraction from the todaySeries and returns it as an array
   * @returns An array of cloud area fractions.
   */
  function getCloudAreaFraction(): number[] {
    const cloudAreaFraction: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      cloudAreaFraction.push(item.data.instant.details.cloud_area_fraction)
    })
    return cloudAreaFraction
  }

  function getFogAreaFraction(): number[] {
    const fogAreaFraction: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      fogAreaFraction.push(item.data.instant.details.fog_area_fraction)
    })
    return fogAreaFraction
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
        text: 'Clouds',
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
      plotOptions: {
        series: {
          stacking: 'normal'
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
          name: 'Clouds',
          data: getCloudAreaFraction(),
          type: 'column',
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '%'
          },
          dataGrouping: {
            enabled: false
          },
          color: 'var(--clouds)'
        },
        {
          name: 'Fog',
          data: getFogAreaFraction(),
          type: 'column',
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '%'
          },
          dataGrouping: {
            enabled: false
          },
          color: 'var(--fog)'
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
