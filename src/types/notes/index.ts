type Note = {
  name: string
  content: string
  user?: string
}

interface SavedNote extends Note {
  id: string
}

export type { SavedNote, Note }
