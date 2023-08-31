import { Store } from 'pinia'
import type { Coordinates, SearchResult, CurrentWeatherData, ForecastData } from '@/types/weather'

type State = {
  activeLocation: string
  activeRegion: string
  coordinates: Coordinates
  currentWeatherData: CurrentWeatherData | null
  forecastData: ForecastData | null
  searchResults: SearchResult[] | []
}

type Getters = unknown

type Actions = {
  getWeatherData: () => void
  getCurrentWeatherData: () => Promise<void>
  getForecastData: () => Promise<void>
  getLocation: (val: string) => Promise<void>
}

type WeatherStore = Store<'weather', State, Getters, Actions>

export { State, Getters, Actions, WeatherStore }
