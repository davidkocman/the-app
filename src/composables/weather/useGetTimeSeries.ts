import { ref } from 'vue'
import TWeatherData from '@/types/weather/TWeatherData'
import TTimeSeries from '@/types/weather/TTimeSeries'

/**
 * It loops through the next 7 days, and for each day it loops through the time marks, and for each
 * time mark it finds the corresponding time series and pushes it to the series array
 * @param {TWeatherData} data - TWeatherData - the data we get from the API
 * @returns An object with a property called series.
 */
export default function useGetTimeSeries(data: TWeatherData) {
  const timeMarks: Date[] = [
    new Date(new Date().setUTCHours(0, 0, 0)),
    new Date(new Date().setUTCHours(6, 0, 0)),
    new Date(new Date().setUTCHours(12, 0, 0)),
    new Date(new Date().setUTCHours(18, 0, 0))
  ]

  let day: Date | string = ''
  let result: TTimeSeries
  const series = ref<TTimeSeries[]>([])

  // loop to get next 7 days
  for (let i = 1; i <= 7; i++) {
    timeMarks.forEach((mark: Date) => {
      day = new Date(mark.setUTCDate(mark.getDate() + i)).toISOString().split('.')[0] + 'Z' // strip miliseconds

      result = data.properties.timeseries.find(({ time }: { time: string }) => time === day) as TTimeSeries // find specific timeseries

      series.value.push(result)
      day = new Date(mark.setUTCDate(mark.getDate() - i))
    })
  }

  return { series }
}
