import { Store } from 'pinia'

import type { GameResult } from '@/types/games'

type State = {
  games: Array<GameResult>
}

type Getters = {
  getCurrenthMonthUpcomingGames: Array<GameResult>
}

type Actions = {
  fetchUpcomingGames: (requestedDate: string) => Promise<void>
}

type GamesStore = Store<'games', State, Getters, Actions>

export type { State, Getters, Actions, GamesStore }
