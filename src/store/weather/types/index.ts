import { Store } from 'pinia'
import type { Coordinates, SearchResult, CurrentWeatherData, ForecastData, Forecast } from '@/types/weather'

type State = {
  activeLocation: string
  activeRegion: string
  coordinates: Coordinates
  currentWeatherData: CurrentWeatherData | null
  forecastData: ForecastData | null
  searchResults: SearchResult[] | []
}

type Getters = {
  forecastDataList: Array<Forecast> | null
}

type Actions = {
  getWeatherData: () => void
  getCurrentWeatherData: () => Promise<void>
  getForecastData: () => Promise<void>
  getLocation: (val: string) => Promise<void>
}

type WeatherStore = Store<'weather', State, Getters, Actions>

export type { State, Getters, Actions, WeatherStore }
