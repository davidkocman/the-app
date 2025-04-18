import { Store } from 'pinia'

type State = {
  games: null
}

type Getters = {}

type Actions = {
}

type GamesStore = Store<'games', State, Getters, Actions>

export type { State, Getters, Actions, GamesStore }
