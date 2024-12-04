import type { State } from './types'

export default function (): State {
  return {
    userData: null,
    loadingUser: false
  }
}
