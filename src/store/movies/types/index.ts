import { Store } from 'pinia'

import type { Movie, MovieDetails, TvShowDetails, MoviesSearchResponse } from '@/types/movies'

type State = {
  searchResults: MoviesSearchResponse | null
  selected: Movie | null
  movie: MovieDetails | null
  tvShow: TvShowDetails | null
  searchFor: 'movie' | 'tv'
}

type Getters = {
  selectedSearchMode: 'movie' | 'tv'
}

type Actions = {
  searchMovie: (query: string) => Promise<void>
  searchTvShow: (query: string) => Promise<void>
  search: (query: string) => void
  getMovieData: (id: number) => void
  getTvShowData: (id: number) => void
  loadEpisodes: (id: number, seasonNumber: number) => void
}

type MoviesStore = Store<'movies', State, Getters, Actions>

export { State, Getters, Actions, MoviesStore }
