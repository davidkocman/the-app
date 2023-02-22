import { defineStore } from 'pinia'
import { useAppStore } from '@/store/app'
import { URL, HEADERS } from '@/utils/requestParams'
import { Movie, MovieDetails, TvShowDetails, Seasons, MoviesSearchResponse } from '@/types/movies'
import getErrorMessage from '@/utils/handleCatchErrors'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    searchResults: null as MoviesSearchResponse | null,
    selected: null as Movie | null,
    movie: null as MovieDetails | null,
    tvShow: null as TvShowDetails | null,
    searchFor: 'movie' as 'movie' | 'tv'
  }),
  actions: {
    async searchMovie(query: string) {
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
    async searchTvShow(query: string) {
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
    search(query: string) {
      if (this.searchFor === 'movie') this.searchMovie(query)
      if (this.searchFor === 'tv') this.searchTvShow(query)
    },
    async getMovieData(id: number) {
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
    async getTvShowData(id: number) {
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
    async loadEpisodes(id: number, seasonNumber: number) {
      const appStore = useAppStore()
      try {
        const response = await fetch(`${URL}/tv/${id}/season/${seasonNumber}`, { headers: HEADERS })
        const data = await response.json()
        const ep = data.episodes
        console.log(ep)

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
})
