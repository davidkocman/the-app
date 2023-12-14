import { defineStore } from 'pinia'

import state from './state'
import { actions } from './actions'
import { getters } from './getters'

export default defineStore('invoices', {
  state,
  getters,
  actions
})
