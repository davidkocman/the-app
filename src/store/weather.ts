import { defineStore } from 'pinia'
import getErrorMessage from '@/utils/handleCatchErrors'
import { useAppStore } from '@/store/app'
import { WeatherData, TimeSeries } from '@/types/weather'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    activeLocation: '',
    activeRegion: '',
    coordinates: [] as string[],
    weatherData: null as WeatherData | null,
    timeSeries: null as TimeSeries[] | null,
    todaySeries: null as TimeSeries[] | null
  }),
  actions: {
    /**
     * It fetches weather data from the Norwegian Meteorological Institute, and then creates a
     * timeseries from the data
     * @param {string} lat - latitude
     * @param {string} lng - longitude
     */
    async getWeatherData(lat: string, lng: string): Promise<void> {
      const appStore = useAppStore()
      appStore.loading = true
      try {
        const response = await fetch(
          `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lng}`
        )
        this.weatherData = await response.json()
        this.createTimeseries()
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    },
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

      this.todaySeries = this.weatherData.properties.timeseries.filter((timeStamp: TimeSeries) =>
        timeStamp.time.includes(today)
      )
      // loop to get next 7 days
      for (let i = 1; i <= 7; i++) {
        timeMarks.forEach((mark: Date) => {
          day = new Date(mark.setUTCDate(mark.getDate() + i)).toISOString().split('.')[0] + 'Z' // strip miliseconds
          result = this.weatherData.properties.timeseries.find(
            ({ time }: { time: string }) => time === day
          ) as TimeSeries // find specific timeseries
          series.push(result)
          day = new Date(mark.setUTCDate(mark.getDate() - i))
        })
      }
      this.timeSeries = series
    }
  }
})
