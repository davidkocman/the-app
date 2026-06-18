type Note = {
  name: string
  content: string
  color?: string | null
  pinned?: boolean
  user?: string
}

interface SavedNote extends Note {
  id: string
}

// Row shape as stored in Supabase (snake_case)
type NoteRow = {
  id: string
  name: string
  content: string
  color: string | null
  pinned: boolean
}

export type { SavedNote, Note, NoteRow }
