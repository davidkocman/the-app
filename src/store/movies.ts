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
    /**
     * It's an async function that takes a query string, sets the loading state to true, fetches the
     * search results from the API, sets the searchResults state to the response, and finally sets the
     * loading state to false
     * @param {string} query - string - The search query.
     */
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
    /**
     * We're using the `useAppStore` hook to get the appStore, then we're setting the loading property
     * to true, then we're making a fetch request to the API, then we're setting the movie property to
     * the response, then we're setting the loading property to false
     * @param {number} id - number - The id of the movie we want to fetch
     */
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
