import { Store } from 'pinia'

import type { UpcomingGamesItem, GameItem } from '@/types/games'

type State = {
  games: Array<UpcomingGamesItem>
  gameItems: Array<GameItem>
  gameDetail: GameItem | null
}

type Getters = {
  getCurrenthMonthUpcomingGames: Array<UpcomingGamesItem>
  getGameDetail: GameItem | null
}

type Actions = {
  fetchUpcomingGames: (requestedDate: string) => Promise<void>
  getItemInfo: (id: number) => Promise<void>
  showGameDetail: (id: number) => void
}

type GamesStore = Store<'games', State, Getters, Actions>

export type { State, Getters, Actions, GamesStore }
