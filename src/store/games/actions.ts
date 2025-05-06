import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import { URL } from '@/utils/rawgRequestParams'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, GamesStore } from './types'
import type { GameResult } from '@/types/games'

export const actions: PiniaActionAdaptor<Actions, GamesStore> = {
  async fetchUpcomingGames(requestedDate) {
    if (this.games.some(obj => obj.released.includes(requestedDate))) return

    const date = requestedDate.split('-')
    const YEAR = date[0]
    const MONTH = date[1]

    const appStore = useAppStore()

    const TAGS = ['clicker']

    const daysInMonth = new Date(Number(YEAR), Number(MONTH), 0).getDate()
    try {
      const response = await fetch(
        `${URL}?key=${import.meta.env.VITE_APP_RAWG_API_KEY}&dates=${YEAR}-${MONTH}-01,${YEAR}-${MONTH}-${daysInMonth < 10 ? `0${daysInMonth}` : daysInMonth}&ordering=-added&exclude_additions=true&page_size=100`
      )
      const data = await response.json()
      if (data.results.length) {
        const filteredGames = data.results.filter((game: GameResult) => {
          const tags = (game.tags || []).map(tag => tag.name.toLowerCase())
          return !tags.some(tag => TAGS.includes(tag))
        }).sort((a: GameResult, b: GameResult) => new Date(a.released).getTime() - new Date(b.released).getTime()) || []
        if (filteredGames.length) {
          filteredGames.forEach((game: GameResult) => {
            this.games.push(game)
          })
        }
      }
    } catch (e) {
      console.error(e)
      appStore.reportError({ message: getErrorMessage(e) })
    }
  }
}