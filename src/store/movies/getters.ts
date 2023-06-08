import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, MoviesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, MoviesStore> = {
  nowPlayingResultsByPopularityDesc() {
    if (this.nowPlaying?.results) {
      return this.nowPlaying.results.sort((a, b) => b.popularity - a.popularity)
    }
    return null
  }
}
