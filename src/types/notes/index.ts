type NewNote = {
  name: string
  content: string
  user?: string
}

type Note = {
  name: string
  content: string
}

type NoteResponse = NewNote & {
  id: string
}

export { NoteResponse, Note, NewNote }
