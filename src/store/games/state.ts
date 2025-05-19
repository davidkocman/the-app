import type { State } from './types'

export default function (): State {
  return {
    games: [],
    gameItems: [],
    gameDetail: null,
  }
}
