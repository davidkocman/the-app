import TTimeSeries from '@/types/weather/TTimeSeries'
import { computed, Ref } from 'vue'

export default function usePrecipitationChartData(timeseries: Ref<TTimeSeries[]>) {
  function getHours() {
    const categories: number[] = []
    timeseries.value.forEach((item: TTimeSeries) => {
      categories.push(new Date(item.time).getHours())
    })

    return categories
  }

  function getCategories() {
    const weekday = ['Nedela', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']
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

  function getPrecipitationAmount(): number[] {
    const precipitationAmount: number[] = []
    timeseries.value.forEach((item: TTimeSeries) => {
      if (item.data.next_6_hours) {
        precipitationAmount.push(item.data.next_6_hours.details.precipitation_amount)
      } else {
        precipitationAmount.push(item.data.instant.details.air_temperature)
      }
    })

    return precipitationAmount
  }

  const chartOptions = computed(() => ({
    chart: {
      backgroundColor: '',
      style: {
        fontFamily: 'Roboto',
      },
    },
    boost: {
      useGPUTranslations: true,
    },
    title: {
      text: 'Množstvo zrážok',
      style: {
        color: 'var(--title-text)',
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      useHTML: true,
      headerFormat: '<span style="font-size: 10px">{point.key}:00</span><br/>',
    },
    legend: {
      itemStyle: {
        color: 'var(--legend)',
        fontWeight: 'bold',
      },
      itemHoverStyle: {
        color: 'grey',
      },
    },
    xAxis: [
      {
        categories: getHours(),
        type: 'category',
        gridLineColor: 'var(--x-hours-gridline)',
        labels: {
          style: {
            color: 'var(--x-hours-labels)',
          },
        },
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
            color: 'var(--x-categories-labels)',
          },
        },
      },
    ],
    yAxis: {
      gridLineDashStyle: 'dash',
      gridLineColor: 'var(--y-gridline)',
      title: {
        text: '(mm)',
        style: {
          color: 'var(--y-title)',
        },
      },
      labels: {
        style: {
          color: 'var(--y-labels)',
        },
      },
    },
    series: [
      {
        name: 'Zrážky',
        data: getPrecipitationAmount(),
        type: 'column',
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: 'mm',
        },
        dataGrouping: {
          enabled: false,
        },
        color: 'var(--precipitation)',
      },
    ],
    credits: {
      enabled: false,
    },
  }))

  return { chartOptions }
}
