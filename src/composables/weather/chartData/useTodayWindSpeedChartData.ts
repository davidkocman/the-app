import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useTodayWindSpeedChartData() {
  const weatherStore = useWeatherStore()
  const { todaySeries } = storeToRefs(weatherStore)

  /**
   * It takes the time series data and returns an array of hours
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
   * It takes the todaySeries object, loops through each item in the value array, and pushes the wind
   * speed value to a new array
   * @returns An array of wind speeds
   */
  function getWindSpeed(): number[] {
    const windSpeed: number[] = []
    todaySeries.value?.forEach((item: TimeSeries) => {
      windSpeed.push(item.data.instant.details.wind_speed * 3.6)
    })
    return windSpeed
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
        text: 'Wind speed',
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
        gridLineDashStyle: 'Solid',
        gridLineColor: 'var(--y-gridline)',
        gridLineWidth: 0,
        title: {
          text: '(km/h)',
          style: {
            color: 'var(--y-title)'
          }
        },
        labels: {
          style: {
            color: 'var(--y-labels)'
          }
        },
        plotBands: [
          {
            from: 0,
            to: 0.2,
            color: 'var(--y-plotbands-odd)',
            label: {
              text: '',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 0.3,
            to: 1.5,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'Breeze',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 1.6,
            to: 3.3,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Light wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 3.4,
            to: 5.4,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'Moderate wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 5.5,
            to: 7.9,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Fairly fresh wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 8,
            to: 10.7,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'Fresh wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 10.8,
            to: 13.8,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Strong wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 13.9,
            to: 17.1,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'Stronger wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 17.2,
            to: 20.7,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Stormy wind',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 20.8,
            to: 24.4,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'A gale',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 24.5,
            to: 28.4,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Strong gale',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 28.5,
            to: 32.6,
            color: 'var(--y-plotbands-even)',
            label: {
              x: 20,
              text: 'A massive gale',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          },
          {
            from: 32.7,
            color: 'var(--y-plotbands-odd)',
            label: {
              x: 20,
              text: 'Hurricane',
              style: {
                color: 'var(--y-plotbands-label)'
              }
            }
          }
        ]
      },
      series: [
        {
          name: 'Wind speed',
          data: getWindSpeed(),
          type: 'spline',
          marker: {
            enabled: false
          },
          dataGrouping: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' km/h'
          },
          color: 'var(--wind-speed)'
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
