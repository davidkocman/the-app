import { defineStore } from 'pinia'

import state from './state'
import { actions } from './actions'
import { getters } from './getters'

export default defineStore('games', {
  state,
  getters,
  actions
})
