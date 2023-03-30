import { Store } from 'pinia'

import type { NoteResponse, Note } from '@/types/notes'

type State = {
  notes: [] | Array<NoteResponse>
}

type Getters = {
  savedNotes: [] | Array<NoteResponse>
}

type Actions = {
  saveNewNote: (payload: Note) => Promise<void>
  editNote: (id: string, note: Note) => Promise<void>
  removeNote: (id: string) => Promise<void>
  getNotes: () => Promise<void>
}

type NotesStore = Store<'notes', State, Getters, Actions>

export { State, Getters, Actions, NotesStore }
