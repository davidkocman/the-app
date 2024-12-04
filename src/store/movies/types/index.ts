import { Store } from 'pinia'

import type { Movie, MovieDetails, TvShowDetails, MoviesSearchResponse, MovieList, MovieItem } from '@/types/movies'

type State = {
  selected: Movie | null
  searchFor: 'movie' | 'tv'
  searchResults: MoviesSearchResponse | null
  searchResult: (MovieDetails & TvShowDetails) | null
  searchResultType: 'movie' | 'tv'
  trending: MovieList | null
  upcoming: MovieList | null
}

type Getters = {
  trendingResultsByPopularityDesc: Array<MovieItem> | null
  upcomingResultsWithPoster: Array<MovieItem> | null
}

type Actions = {
  searchMovie: (query: string) => Promise<void>
  searchTvShow: (query: string) => Promise<void>
  search: (query: string) => void
  getMovieData: (id: number) => void
  getTvShowData: (id: number) => void
  loadEpisodes: (id: number, seasonNumber: number) => void
  getTrending: () => Promise<void>
  getUpcoming: () => Promise<void>
}

type MoviesStore = Store<'movies', State, Getters, Actions>

export type { State, Getters, Actions, MoviesStore }
