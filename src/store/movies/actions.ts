import { URL, HEADERS } from '@/utils/tmdbRequestParams'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, MoviesStore } from './types'
import type { Seasons } from '@/types/movies'

export const actions: PiniaActionAdaptor<Actions, MoviesStore> = {
  async searchMovie(query) {
    const appStore = useAppStore()
    try {
      appStore.loading = true
      const response = await fetch(`${URL}/search/movie?query=${query}`, {
        headers: HEADERS
      })
      this.searchResults = await response.json()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async searchTvShow(query) {
    const appStore = useAppStore()
    try {
      appStore.loading = true
      const response = await fetch(`${URL}/search/tv?query=${query}`, {
        headers: HEADERS
      })
      this.searchResults = await response.json()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  search(query) {
    if (this.searchFor === 'movie') {
      this.searchMovie(query)
      return
    }
    this.searchTvShow(query)
  },
  async getMovieData(id) {
    const appStore = useAppStore()
    try {
      appStore.loading = true
      const response = await fetch(`${URL}/movie/${id}?append_to_response=reviews,credits`, { headers: HEADERS })
      this.searchResult = await response.json()
      this.searchResultType = 'movie'
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getTvShowData(id) {
    const appStore = useAppStore()
    try {
      appStore.loading = true
      const response = await fetch(`${URL}/tv/${id}?append_to_response=reviews,credits`, { headers: HEADERS })
      this.searchResult = await response.json()
      this.searchResultType = 'tv'
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async loadEpisodes(id, seasonNumber) {
    const appStore = useAppStore()
    try {
      const response = await fetch(`${URL}/tv/${id}/season/${seasonNumber}`, { headers: HEADERS })
      const data = await response.json()
      const ep = data.episodes
      if (this.searchResult) {
        const seasonIndex = this.searchResult.seasons.findIndex((x: Seasons) => x.season_number === seasonNumber)
        this.searchResult.seasons[seasonIndex].episodes = ep
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  },
  async getTrending() {
    const appStore = useAppStore()
    try {
      const response = await fetch(`${URL}/trending/movie/week?language=en-US`, {
        headers: HEADERS
      })
      this.trending = await response.json()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  },
  async getUpcoming() {
    const appStore = useAppStore()
    try {
      const response = await fetch(
        `${URL}/discover/movie?include_adult=false&include_video=false&page=1&with_original_language=en&region=SK,CZ,DE&primary_release_date.gte=${new Date()
          .toISOString()
          .slice(0, 10)}&sort_by=primary_release_date.asc`,
        {
          headers: HEADERS
        }
      )
      this.upcoming = await response.json()
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    }
  }
}
