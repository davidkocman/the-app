import { useQuasar } from 'quasar'

import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, AppStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, AppStore> = {
  isDarkMode() {
    const $q = useQuasar()
    return $q.dark.isActive
  }
}
