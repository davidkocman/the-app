type NewNote = {
  name: string
  content: string
  user?: string
}

type Note = {
  name: string
  content: string
}

type SavedNote = NewNote & {
  id: string
}

export { SavedNote, Note, NewNote }
