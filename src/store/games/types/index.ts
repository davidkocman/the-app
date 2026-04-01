import { Store } from 'pinia'

import type { UpcomingGamesItem, GameItem, Screenshot, Movie } from '@/types/games'

type State = {
  games: Array<UpcomingGamesItem>
  gameItems: Array<GameItem>
  gameDetail: GameItem | null
  gameScreenshots: Screenshot[]
  gameMovies: Movie[]
}

type Getters = {
  getCurrenthMonthUpcomingGames: Array<UpcomingGamesItem>
  getGameDetail: GameItem | null
}

type Actions = {
  fetchUpcomingGames: (requestedDate: string) => Promise<void>
  getItemInfo: (id: number) => Promise<void>
  showGameDetail: (id: number) => void
  fetchGameScreenshots: (id: number) => Promise<void>
  fetchGameMovies: (id: number) => Promise<void>
}

type GamesStore = Store<'games', State, Getters, Actions>

export type { State, Getters, Actions, GamesStore }
