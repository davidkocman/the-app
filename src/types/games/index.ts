export interface UpcomingGamesResponse {
  count: number
  next: string
  previous: null
  results: UpcomingGamesItem[]
  user_platforms: boolean
}

export interface UpcomingGamesItem {
  added_by_status: AddedByStatus | null
  added: number
  background_image: string
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
  The0F0F0F = '0f0f0f'
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
  Exceptional = 'exceptional',
  Meh = 'meh',
  Recommended = 'recommended',
  Skip = 'skip'
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

export interface GameItem {
  id: number
  slug: string
  name: string
  name_original: string
  description: string
  description_raw?: string
  metacritic: number
  metacritic_platforms: Array<MetacriticPlatform>
  released: string
  tba: boolean
  updated: string
  background_image: string
  background_image_additional: string
  website: string
  rating: number
  rating_top: number
  ratings: Ratings
  reactions: Reactions
  added: number
  added_by_status: AddedByStatus
  playtime: number
  screenshots_count: number
  movies_count: number
  creators_count: number
  achievements_count: number
  parent_achievements_count: string
  reddit_url: string
  reddit_name: string
  reddit_description: string
  reddit_logo: string
  reddit_count: number
  twitch_count: string
  youtube_count: string
  reviews_text_count: string
  ratings_count: number
  suggestions_count: number
  alternative_names: Array<string>
  metacritic_url: string
  parents_count: number
  additions_count: number
  game_series_count: number
  esrb_rating: EsrbRating
  platforms: PlatformMeta[]
}

export interface MetacriticPlatform {
  metascore: number
  url: string
}

export interface Ratings {}

export interface Reactions {}

export interface AddedByStatus {}

export interface EsrbRating {
  id: number
  slug: string
  name: string
}

export interface PlatformMeta {
  platform: Platform
  released_at: string
  requirements: Requirements
}

export interface Platform {
  id: number
  slug: string
  name: string
}

export interface Requirements {
  minimum: string
  recommended: string
}

export enum Language {
  Eng = 'eng',
  Rus = 'rus'
}
