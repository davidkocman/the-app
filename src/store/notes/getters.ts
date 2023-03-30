import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, NotesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, NotesStore> = {
  savedNotes() {
    return this.notes
  }
}
