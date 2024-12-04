import { Store } from 'pinia'

import type { SavedNote, Note } from '@/types/notes'

type State = {
  notes: Array<SavedNote>
}

type Getters = {
  savedNotes: [] | Array<SavedNote>
}

type Actions = {
  saveNewNote: (payload: Note) => Promise<void>
  editNote: (id: string, note: Note) => Promise<void>
  removeNote: (id: string) => Promise<void>
  getNotes: () => Promise<void>
}

type NotesStore = Store<'notes', State, Getters, Actions>

export type { State, Getters, Actions, NotesStore }
