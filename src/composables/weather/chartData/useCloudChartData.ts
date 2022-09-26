import TTimeSeries from '@/types/weather/TTimeSeries'
import { computed, Ref } from 'vue'

export default function useCloudChartData(timeseries: Ref<TTimeSeries[]>) {
  /**
   * It takes the time property of each item in the timeseries array and returns an array of hours
   * @returns An array of hours from the timeseries data.
   */
  function getHours() {
    const categories: number[] = []
    timeseries.value.forEach((item: TTimeSeries) => {
      categories.push(new Date(item.time).getHours())
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
    timeseries.value.forEach((item: TTimeSeries) => {
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
   * It takes the cloud area fraction from the timeseries and returns it as an array
   * @returns An array of cloud area fractions.
   */
  function getCloudAreaFraction(): number[] {
    const cloudAreaFraction: number[] = []
    timeseries.value.forEach((item: TTimeSeries) => {
      cloudAreaFraction.push(item.data.instant.details.cloud_area_fraction)
    })
    return cloudAreaFraction
  }

  const chartOptions = computed(() => ({
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
      crosshairs: true,
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
      gridLineDashStyle: 'dash',
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
        maxPointWidth: 10,
        color: 'var(--clouds)'
      }
    ],
    credits: {
      enabled: false
    }
  }))

  return { chartOptions }
}
