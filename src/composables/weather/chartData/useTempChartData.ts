import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useTempChartData() {
  const weatherStore = useWeatherStore()
  const { timeSeries } = storeToRefs(weatherStore)

  /**
   * It takes the time property of each item in the timeseries array and returns an array of hours
   * @returns An array of hours from the timeseries data.
   */
  function getHours() {
    const categories: string[] = []
    timeSeries.value?.forEach((item: TimeSeries) => {
      categories.push(new Date(item.time).getHours().toString())
    })

    return categories
  }

  /**
   * It takes the timeseries array and returns an array of categories
   * @returns Array of strings
   */
  function getCategories() {
    const weekday = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']
    const categories: string[] = []
    timeSeries.value?.forEach((item: TimeSeries) => {
      categories.push(
        weekday[new Date(item.time).getDay()] +
          '<br>' +
          new Date(item.time).getDate() +
          '.' +
          (new Date(item.time).getMonth() + 1) +
          '.'
      )
    })

    return categories
  }

  /**
   * It takes two numbers as arguments, and returns a number
   * @param {number} hR - Relative humidity in %
   * @param {number} T - Temperature in degrees Celsius
   * @returns The steam pressure in Pascal
   */
  function steamPressure(hR: number, T: number): number {
    return Math.round((hR / 100) * 6.105 * Math.exp((12.27 * T) / (237.7 + T)))
  }

  /**
   * It takes the air temperature and relative humidity from the API and calculates the minimum feel
   * temperature for the next 6 hours
   * @returns An array of numbers
   */
  function getMinFeelTemperature(): number[] {
    const minFeelTemp: number[] = []
    timeSeries.value?.forEach((item: TimeSeries) => {
      if (item.data.next_6_hours) {
        const minFTemp: number =
          item.data.next_6_hours.details.air_temperature_min +
          0.32 *
            steamPressure(
              item.data.instant.details.relative_humidity,
              item.data.next_6_hours.details.air_temperature_min
            ) -
          0.7 * item.data.instant.details.wind_speed -
          4
        minFeelTemp.push(Math.round(minFTemp))
      } else {
        const minFTemp: number =
          item.data.instant.details.air_temperature +
          0.32 * steamPressure(item.data.instant.details.relative_humidity, item.data.instant.details.air_temperature) -
          0.7 * item.data.instant.details.wind_speed -
          4
        minFeelTemp.push(Math.round(minFTemp))
      }
    })

    return minFeelTemp
  }

  /**
   * It takes the air temperature and relative humidity and calculates the maximum feel temperature for
   * the next 6 hours
   * @returns An array of numbers.
   */
  function getMaxFeelTemperature(): number[] {
    const maxFeelTemp: number[] = []

    timeSeries.value?.forEach((item: TimeSeries) => {
      if (item.data.next_6_hours) {
        const maxFTemp: number =
          item.data.next_6_hours.details.air_temperature_max +
          0.32 *
            steamPressure(
              item.data.instant.details.relative_humidity,
              item.data.next_6_hours.details.air_temperature_max
            ) -
          0.7 * item.data.instant.details.wind_speed -
          4
        maxFeelTemp.push(Math.round(maxFTemp))
      } else {
        const maxFTemp: number =
          item.data.instant.details.air_temperature +
          0.32 * steamPressure(item.data.instant.details.relative_humidity, item.data.instant.details.air_temperature) -
          0.7 * item.data.instant.details.wind_speed -
          4
        maxFeelTemp.push(Math.round(maxFTemp))
      }
    })

    return maxFeelTemp
  }

  /**
   * It loops through the timeseries array and pushes the minimum temperature for each hour into a new
   * array
   * @returns An array of numbers
   */
  function getMinTemperature(): number[] {
    const minTemp: number[] = []

    timeSeries.value?.forEach((item: TimeSeries) => {
      if (item.data.next_6_hours) {
        minTemp.push(item.data.next_6_hours.details.air_temperature_min)
      } else {
        minTemp.push(item.data.instant.details.air_temperature)
      }
    })

    return minTemp
  }

  /**
   * It takes the timeseries data and returns an array of the maximum temperatures for the next 6 hours
   * @returns An array of numbers
   */
  function getMaxTemperature(): number[] {
    const maxTemp: number[] = []
    timeSeries.value?.forEach((item: TimeSeries) => {
      if (item.data.next_6_hours) {
        maxTemp.push(item.data.next_6_hours.details.air_temperature_max)
      } else {
        maxTemp.push(item.data.instant.details.air_temperature)
      }
    })

    return maxTemp
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
        text: 'Temperature forecast',
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
        },
        {
          categories: getCategories(),
          type: 'category',
          tickInterval: 4,
          gridLineWidth: 1,
          gridLineColor: 'var(--x-categories-gridline)',
          lineWidth: 0,
          linkedTo: 0,
          margin: 0,
          labels: {
            align: 'left',
            style: {
              color: 'var(--x-categories-labels)'
            }
          }
        }
      ],
      yAxis: {
        gridLineDashStyle: 'Dash',
        gridLineColor: 'var(--y-gridline)',
        plotLines: [
          {
            color: 'var(--y-plotlines)',
            dashStyle: 'Solid',
            width: 1,
            value: 0,
            zIndex: 2
          }
        ],
        title: {
          text: '(°C)',
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
          name: 'Max. temp.',
          data: getMaxTemperature(),
          type: 'column',
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '°C'
          },
          dataGrouping: {
            enabled: false
          },
          color: 'var(--temp-series-max-temp)'
        },
        {
          name: 'Max. feel temp.',
          data: getMaxFeelTemperature(),
          type: 'spline',
          zIndex: 5,
          marker: {
            enabled: false
          },
          dataGrouping: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '°C'
          },
          color: 'var(--temp-series-max-feel-temp)'
        },
        {
          name: 'Min. temp.',
          data: getMinTemperature(),
          type: 'column',
          marker: {
            enabled: false
          },
          dataGrouping: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '°C'
          },
          color: 'var(--temp-series-min-temp)'
        },
        {
          name: 'Min. feel temp.',
          data: getMinFeelTemperature(),
          type: 'spline',
          zIndex: 5,
          marker: {
            enabled: false
          },
          dataGrouping: {
            enabled: false
          },
          tooltip: {
            valueSuffix: '°C'
          },
          color: 'var(--temp-series-min-feel-temp)'
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
