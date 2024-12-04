type Movie = {
  poster_path: string
  adult: boolean
  overview: string
  release_date: string
  genre_ids: number[]
  id: number
  original_title: string
  original_language: string
  title: string
  backdrop_path: string
  popularity: number
  vote_count: number
  video: boolean
  vote_average: number
}

type MoviesSearchResponse = {
  page: number
  results: Array<Movie>
}

type Reviews = {
  page: number
  results: Array<{
    author: string
    author_details: {
      name: string
      username: string
      avatar_path: string | null
      rating: number | null
    }
    content: string
    created_at: string
    id: string
    updated_at: string
    url: string
  }>
  total_pages: number
  total_results: number
}

type Seasons = {
  air_date: string
  episode_count: number
  episodes?: Array<{
    id: number
    name: string
    air_date: string
    runtime: string
  }>
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
}

type MovieDetails = {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: null | object
  budget: number
  credits: {
    cast: Array<{
      adult: boolean
      character: string
      gender: number | null
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path: string | null
      credit_id: string
      order: number
    }>
    crew: Array<{
      adult: boolean
      gender: number | null
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path: string | null
      credit_id: string
      department: string
      job: string
    }>
  }
  genres: Array<{
    id: number
    name: string
  }>
  homepage: string | null
  id: number
  imdb_id: string | null
  original_language: string
  original_title: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: Array<{
    name: string
    id: number
    logo_path: string | null
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  release_date: string
  revenue: number
  reviews: Reviews
  runtime: number | null
  spoken_languages: Array<{
    iso_639_1: string
    name: string
  }>
  status: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled'
  tagline: string | null
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

type TvShowDetails = {
  backdrop_path: string | null
  created_by: Array<{
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path: string | null
  }>
  credits: {
    cast: Array<{
      adult: boolean
      character: string
      gender: number | null
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path: string | null
      credit_id: string
      order: number
    }>
    crew: Array<{
      adult: boolean
      gender: number | null
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path: string | null
      credit_id: string
      department: string
      job: string
    }>
  }
  episode_run_time: number[]
  first_air_date: string
  genres: Array<{
    id: number
    name: string
  }>
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: Array<{
    air_date: string
    episode_number: number
    id: number
    name: string
    overview: string
    production_code: string
    season_number: number
    still_path: string | null
    vote_average: number
    vote_count: number
  }>
  name: string
  next_episode_to_air: string | null
  networks: Array<{
    name: string
    id: number
    logo_path: string | null
    origin_country: string
  }>
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: Array<{
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  reviews: Reviews
  seasons: Array<Seasons>
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

type MovieItem = {
  adult: boolean
  backdrop_path: string
  genre_ids: Array<number>
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

type MovieList = {
  dates?: {
    maximum: string
    minimum: string
  }
  page: number
  results: Array<MovieItem>
  total_pages: number
  total_results: number
}

export type { Movie, MovieDetails, TvShowDetails, Seasons, Reviews, MoviesSearchResponse, MovieList, MovieItem }
