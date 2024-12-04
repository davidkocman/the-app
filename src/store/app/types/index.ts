import { Store } from 'pinia'

type State = {
  drawer: boolean
  miniState: boolean
  loading: boolean
  errorMessage: string
}

type Getters = {
  isDarkMode: boolean
}

type Actions = {
  reportError: ({ message }: { message: string }) => void
}

type AppStore = Store<'app', State, Getters, Actions>

export type { State, Getters, Actions, AppStore }
