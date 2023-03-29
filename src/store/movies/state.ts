import type { State } from './types'

export default function (): State {
  return {
    searchResults: null,
    selected: null,
    movie: null,
    tvShow: null,
    searchFor: 'movie'
  }
}
