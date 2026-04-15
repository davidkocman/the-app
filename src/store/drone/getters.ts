import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, DroneStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, DroneStore> = {
  getRecords() {
    return this.records
  },
  getFrames() {
    return this.frames
  }
}
