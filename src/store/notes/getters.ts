import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, NotesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, NotesStore> = {
  savedNotes() {
    // Pinned notes float to the top, then alphabetical within each group.
    return [...this.notes].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  }
}
