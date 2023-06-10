import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, MoviesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, MoviesStore> = {
  trendingResultsByPopularityDesc() {
    if (this.trending?.results) {
      return this.trending.results.sort((a, b) => b.popularity - a.popularity)
    }
    return null
  }
}
