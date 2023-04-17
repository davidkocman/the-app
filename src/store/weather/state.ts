import type { State } from './types'

export default function (): State {
  return {
    activeLocation: '',
    activeRegion: '',
    coordinates: [],
    weatherData: null,
    timeSeries: null,
    todaySeries: null
  }
}
