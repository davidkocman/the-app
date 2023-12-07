import useAppStore from '@/store/app/'
import getErrorMessage from '@/utils/handleCatchErrors'
import {
  getGeoRequestUrl,
  getCurrentWeatherRequestUrl,
  get5DaysForecastRequestUrl
} from '@/utils/openWeatherRequestUrl'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, WeatherStore } from './types'

export const actions: PiniaActionAdaptor<Actions, WeatherStore> = {
  async getWeatherData() {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      await this.getCurrentWeatherData()
      await this.getForecastData()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getCurrentWeatherData() {
    const appStore = useAppStore()
    try {
      if (this.coordinates.lat !== null && this.coordinates.lon !== null) {
        const response = await fetch(getCurrentWeatherRequestUrl(this.coordinates.lat, this.coordinates.lon))
        this.currentWeatherData = await response.json()
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  },
  async getForecastData() {
    const appStore = useAppStore()
    try {
      if (this.coordinates.lat !== null && this.coordinates.lon !== null) {
        const response = await fetch(get5DaysForecastRequestUrl(this.coordinates.lat, this.coordinates.lon))
        this.forecastData = await response.json()
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  },
  async getLocation(val) {
    const appStore = useAppStore()
    try {
      const response = await fetch(getGeoRequestUrl(val))
      this.searchResults = await response.json()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  }
}
