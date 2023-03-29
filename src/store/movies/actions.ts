import { URL, HEADERS } from '@/utils/requestParams'
import useAppStore from '@/store/app/useAppStore'
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
      this.movie = await response.json()
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
      this.tvShow = await response.json()
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
      if (this.tvShow) {
        const seasonIndex = this.tvShow.seasons.findIndex((x: Seasons) => x.season_number === seasonNumber)
        this.tvShow.seasons[seasonIndex].episodes = ep
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
