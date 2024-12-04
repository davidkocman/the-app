import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, UserStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, UserStore> = {
  user() {
    return this.userData
  }
}