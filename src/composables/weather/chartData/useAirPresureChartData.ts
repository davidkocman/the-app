import TTimeSeries from '@/types/weather/TTimeSeries'
import { computed, Ref } from 'vue'

export default function useAirPresureChartData(timeseries: Ref<TTimeSeries[]>) {
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
   * It takes the timeseries array and creates a new array of categories
   * @returns Array of strings
   */
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

  /**
   * It takes the `timeseries` object, loops through each item in the `value` array, and pushes the
   * `air_pressure_at_sea_level` value into a new array
   * @returns An array of numbers
   */
  function getAirPresure(): number[] {
    const airPresure: number[] = []
    timeseries.value.forEach((item: TTimeSeries) => {
      airPresure.push(item.data.instant.details.air_pressure_at_sea_level)
    })
    return airPresure
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
      text: 'Tlak vzduchu',
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
      plotLines: [
        {
          color: 'var(--y-gridline)',
          dashStyle: 'solid',
          width: 1,
          value: 1013.25,
          zIndex: 4,
          label: {
            text: 'Štandardný tlak 1013.25 hPa',
            style: {
              color: 'var(--y-plotlines-label)',
            },
          },
        },
      ],
      title: {
        text: '(hPa)',
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
        name: 'Tlak vzduchu',
        data: getAirPresure(),
        type: 'spline',
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: ' hPa',
        },
        dataGrouping: {
          enabled: false,
        },
        zones: [
          {
            value: 1013.25,
            color: 'var(--air-pressure-low)',
          },
          {
            color: 'var(--air-pressure-high)',
          },
        ],
        color: 'var(--air-pressure-break)',
      },
    ],
    credits: {
      enabled: false,
    },
  }))

  return { chartOptions }
}
