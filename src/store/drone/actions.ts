import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, DroneStore } from './types'

export const actions: PiniaActionAdaptor<Actions, DroneStore> = {
  addRecord(record) {
    this.records.push(record)
  },
  removeRecord(id) {
    this.records = this.records.filter((r) => r.id !== id)
  }
}
