import { defineStore } from 'pinia'
import { useAppStore } from '@/store/app'
import { URL, HEADERS } from '@/utils/requestParams'
import { Selected, MovieData, TvShowData, MoviesResponse } from '@/types/movies'
import getErrorMessage from '@/utils/handleCatchErrors'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    searchResults: null as MoviesResponse | null,
    selected: null as Selected | null,
    movie: null as MovieData | null,
    tvShow: null as TvShowData | null,
    searchFor: 'movie' as 'movie' | 'tv'
  }),
  actions: {
    async searchMovie(query: string) {
      const appStore = useAppStore()
      try {
        appStore.loading = true
        const response = await fetch(`${URL}/search/movie?query=${query}`, { headers: HEADERS })
        this.searchResults = await response.json()
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    },
    async searchTvShow(query: string) {
      const appStore = useAppStore()
      try {
        appStore.loading = true
        const response = await fetch(`${URL}/search/tv?query=${query}`, { headers: HEADERS })
        this.searchResults = await response.json()
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    },
    search(query: string) {
      if (this.searchFor === 'movie') this.searchMovie(query)
      if (this.searchFor === 'tv') this.searchTvShow(query)
    },
    async getMovieData(id: number) {
      const appStore = useAppStore()
      try {
        appStore.loading = true
        const response = await fetch(`${URL}/movie/${id}`, { headers: HEADERS })
        this.movie = await response.json()
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    },
    async getTvShowData(id: number) {
      const appStore = useAppStore()
      try {
        appStore.loading = true
        const response = await fetch(`${URL}/tv/${id}`, { headers: HEADERS })
        this.tvShow = await response.json()
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    }
  }
})
