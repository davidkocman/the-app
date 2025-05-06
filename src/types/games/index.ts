export interface UpcomingGamesResponse {
  count: number
  next: string
  previous: null
  results: GameResult[]
  user_platforms: boolean
}

export interface GameResult {
  added_by_status: AddedByStatus | null
  added: number
  background_image: null | string
  clip: null
  community_rating?: number
  dominant_color: Color
  esrb_rating: EsrbRating | null
  genres: Genre[]
  id: number
  metacritic: null
  name: string
  parent_platforms: Platform[]
  platforms: Platform[]
  playtime: number
  rating_top: number
  rating: number
  ratings_count: number
  ratings: Rating[]
  released: string
  reviews_count: number
  reviews_text_count: number
  saturated_color: Color
  score: null
  short_screenshots: ShortScreenshot[]
  slug: string
  stores: Store[] | null
  suggestions_count: number
  tags: Tag[]
  tba: boolean
  updated: Date
  user_game: null
}

export interface AddedByStatus {
  beaten?: number
  dropped?: number
  owned?: number
  playing?: number
  toplay?: number
  yet?: number
}

export enum Color {
  The0F0F0F = "0f0f0f"
}

export interface EsrbRating {
  id: number
  name: string
  slug: string
  name_en: string
  name_ru: string
}

export interface Genre {
  id: number
  name: string
  slug: string
}

export interface Platform {
  platform: Genre
}

export interface Rating {
  id: number
  title: Title
  count: number
  percent: number
}

export enum Title {
  Exceptional = "exceptional",
  Meh = "meh",
  Recommended = "recommended",
  Skip = "skip"
}

export interface ShortScreenshot {
  id: number
  image: string
}

export interface Store {
  store: Genre
}

export interface Tag {
  id: number
  name: string
  slug: string
  language: Language
  games_count: number
  image_background: string
}

export enum Language {
  Eng = "eng",
  Rus = "rus"
}
