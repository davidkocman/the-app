import { Dark } from 'quasar'

import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, AppStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, AppStore> = {
  isDarkMode() {
    return Dark.isActive
  }
}
