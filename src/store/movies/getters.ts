import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, MoviesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, MoviesStore> = {
  selectedSearchMode() {
    return this.searchFor
  }
}
