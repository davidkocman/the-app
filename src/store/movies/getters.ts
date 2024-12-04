import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, MoviesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, MoviesStore> = {
  trendingResultsByPopularityDesc() {
    return this.trending?.results ? this.trending.results.sort((a, b) => b.popularity - a.popularity) : null
  },
  upcomingResultsWithPoster() {
    return this.upcoming?.results ? this.upcoming.results.filter((item) => item.backdrop_path) : null
  }
}
