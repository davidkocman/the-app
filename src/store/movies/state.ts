import type { State } from './types'

export default function (): State {
  return {
    searchResults: null,
    selected: null,
    searchFor: 'movie',
    searchResult: null,
    searchResultType: 'movie',
    trending: null,
    upcoming: null
  }
}
