import type { State } from './types'

export default function (): State {
  return {
    activeLocation: '',
    activeRegion: '',
    coordinates: {
      lat: null,
      lon: null
    },
    currentWeatherData: null,
    forecastData: null,
    searchResults: []
  }
}
