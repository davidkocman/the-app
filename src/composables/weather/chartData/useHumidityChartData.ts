import { TimeSeries } from '@/types/weather'
import { computed, Ref } from 'vue'
import type { Options as HighchartsOptions } from 'highcharts'

export default function useHumidityChartData(timeseries: Ref<TimeSeries[]>) {
  function getHours() {
    const categories: string[] = []
    timeseries.value.forEach((item: TimeSeries) => {
      categories.push(new Date(item.time).getHours().toString())
    })

    return categories
  }

  function getCategories() {
    const weekday = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']
    const categories: string[] = []
    timeseries.value.forEach((item: TimeSeries) => {
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

  function getRelativeHumidity(): number[] {
    const relativeHumidity: number[] = []
    timeseries.value.forEach((item: TimeSeries) => {
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
        },
        {
          categories: getCategories(),
          type: 'category',
          tickInterval: 4,
          gridLineWidth: 1,
          gridLineColor: 'var(--x-categories-gridline)',
          lineWidth: 0,
          linkedTo: 0,
          margin: 1,
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
          maxPointWidth: 10,
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
