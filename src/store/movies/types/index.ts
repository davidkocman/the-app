import { Store } from 'pinia'

import type { Movie, MovieDetails, TvShowDetails, MoviesSearchResponse, MovieList, MovieItem } from '@/types/movies'

type State = {
  searchResults: MoviesSearchResponse | null
  selected: Movie | null
  searchFor: 'movie' | 'tv'
  searchResult: (MovieDetails & TvShowDetails) | null
  searchResultType: 'movie' | 'tv'
  nowPlaying: MovieList | null
  upcoming: MovieList | null
}

type Getters = {
  nowPlayingResultsByPopularityDesc: Array<MovieItem> | null
}

type Actions = {
  searchMovie: (query: string) => Promise<void>
  searchTvShow: (query: string) => Promise<void>
  search: (query: string) => void
  getMovieData: (id: number) => void
  getTvShowData: (id: number) => void
  loadEpisodes: (id: number, seasonNumber: number) => void
  getNowPlaying: () => Promise<void>
  getUpcoming: () => Promise<void>
}

type MoviesStore = Store<'movies', State, Getters, Actions>

export { State, Getters, Actions, MoviesStore }
