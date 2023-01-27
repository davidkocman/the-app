import { defineStore } from 'pinia'
import { useAppStore } from '@/store/app'
import { URL, HEADERS } from '@/utils/requestParams'
import getErrorMessage from '@/utils/handleCatchErrors'
import { SelectedMovie, MovieData, MoviesResponse } from '@/types/movies'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    searchResults: null as MoviesResponse | null,
    selectedMovie: null as SelectedMovie | null,
    movie: null as MovieData | null
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
    }
  }
})
