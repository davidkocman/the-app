import { computed } from 'vue'
import useWeatherStore from '@/store/weather'

import type { TimeSeries } from '@/types/weather'

/**
 * It takes an array of time series data as an argument and returns the minimum and maximum temperature
 * of the day
 * @param timeseries - Ref<TTimeSeries[]>
 * @returns An object with two computed properties.
 */
export default function useFindMinMaxTemp() {
  const weatherStore = useWeatherStore()
  /* Getting the current date in ISO format and splitting it at the 'T' character. */
  const dateIsoString: string = new Date(new Date()).toISOString().split('T')[0]

  /* A computed property that returns the minimum temperature of the day. */
  const minTemp = computed(() => {
    const todaySeries: TimeSeries[] = []
    weatherStore.weatherData?.properties.timeseries.forEach((item: TimeSeries) => {
      if (item.time.includes(dateIsoString)) {
        todaySeries.push(item)
      }
    })

    return todaySeries.reduce(
      (min, p: TimeSeries) =>
        p.data.instant.details.air_temperature < min ? p.data.instant.details.air_temperature : min,
      todaySeries[0].data.instant.details.air_temperature
    )
  })

  /**
   * This function returns the maximum temperature for a given day
   * @param {string} dateIsoString - The date for which the maximum temperature is to be returned
   * @returns {number} - The maximum temperature for the given date
   */
  const maxTemp = computed(() => {
    const todaySeries: TimeSeries[] = []
    weatherStore.weatherData?.properties.timeseries.forEach((item: TimeSeries) => {
      if (item.time.includes(dateIsoString)) {
        todaySeries.push(item)
      }
    })

    return todaySeries.reduce(
      (max, p) => (p.data.instant.details.air_temperature > max ? p.data.instant.details.air_temperature : max),
      todaySeries[0].data.instant.details.air_temperature
    )
  })

  return {
    minTemp,
    maxTemp
  }
}
