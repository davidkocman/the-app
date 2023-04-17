import { Store } from 'pinia'

import type { TimeSeries, WeatherData } from '@/types/weather'

type State = {
  activeLocation: string
  activeRegion: string
  coordinates: [] | string[]
  weatherData: WeatherData | null
  timeSeries: TimeSeries[] | null
  todaySeries: TimeSeries[] | null
}

type Getters = unknown

type Actions = {
  getWeatherData: (lat: string, lng: string) => Promise<void>
  createTimeseries: () => void
}

type WeatherStore = Store<'weather', State, Getters, Actions>

export { State, Getters, Actions, WeatherStore }
