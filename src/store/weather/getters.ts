import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, WeatherStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, WeatherStore> = {
  forecastDataList() {
    return this.forecastData ? this.forecastData.list : null
  }
}
