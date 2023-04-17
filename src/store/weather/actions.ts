import useAppStore from '@/store/app/'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, WeatherStore } from './types'
import type { TimeSeries } from '@/types/weather'

export const actions: PiniaActionAdaptor<Actions, WeatherStore> = {
  /**
   * Asynchronously fetches weather data from the Met.no API based on latitude and longitude coordinates.
   *
   * @async
   * @param {number} lat - The latitude coordinate of the location to retrieve weather data for.
   * @param {number} lng - The longitude coordinate of the location to retrieve weather data for.
   */
  async getWeatherData(lat, lng) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`)
      this.weatherData = await response.json()
      this.createTimeseries()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  /**
   * Creates a time series of weather data for the next 7 days.
   *
   * This function creates a time series of weather data for the next 7 days.
   * It first gets today's date and sets up an array of four time marks at
   * different times throughout the day. It then filters out all timestamps
   * from weatherData that match today's date and stores them in todaySeries.
   * Next, it loops through each day over the next week and adds each timestamp
   * corresponding to one of the four time marks to an array called series.
   * Finally, it sets timeSeries equal to this array.
   *
   * @returns {void}
   */
  createTimeseries() {
    const today = new Date().toJSON().slice(0, 10)
    const timeMarks: Date[] = [
      new Date(new Date().setUTCHours(0, 0, 0)),
      new Date(new Date().setUTCHours(6, 0, 0)),
      new Date(new Date().setUTCHours(12, 0, 0)),
      new Date(new Date().setUTCHours(18, 0, 0))
    ]
    let day: Date | string = ''
    let result: TimeSeries
    const series: TimeSeries[] = []

    if (this.weatherData) {
      this.todaySeries = this.weatherData.properties.timeseries.filter((timeStamp: TimeSeries) =>
        timeStamp.time.includes(today)
      )
      // loop to get next 7 days
      for (let i = 1; i <= 7; i++) {
        timeMarks.forEach((mark: Date) => {
          day = new Date(mark.setUTCDate(mark.getDate() + i)).toISOString().split('.')[0] + 'Z' // strip miliseconds
          result = this.weatherData?.properties.timeseries.find(
            ({ time }: { time: string }) => time === day
          ) as TimeSeries // find specific timeseries
          series.push(result)
          day = new Date(mark.setUTCDate(mark.getDate() - i))
        })
      }
      this.timeSeries = series
    }
  }
}
