import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, GamesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, GamesStore> = {
  getCurrenthMonthUpcomingGames() {
    return this.games
  },
  getGameDetail() {
    return this.gameDetail
  }
}
