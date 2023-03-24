import type { State } from './types'

export default function (): State {
  return {
    drawer: true,
    miniState: true,
    loading: false,
    errorMessage: ''
  }
}
