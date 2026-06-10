import { supabase } from '@/supabaseConfig'
import getUserId from '@/utils/getUserId'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, NotesStore } from './types'
import type { NoteRow, SavedNote } from '@/types/notes'

const toSavedNote = (row: NoteRow): SavedNote => ({
  id: row.id,
  name: row.name,
  content: row.content
})

export const actions: PiniaActionAdaptor<Actions, NotesStore> = {
  async saveNewNote(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: uid, name: payload.name, content: payload.content })
        .select('id, name, content')
        .single()
      if (error) throw error
      this.notes.push(toSavedNote(data as NoteRow))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async editNote(id, note) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      // Ownership is enforced by RLS (auth.uid() = user_id).
      const { error } = await supabase
        .from('notes')
        .update({ name: note.name, content: note.content, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      this.notes = this.notes.map((item: SavedNote) => (item.id === id ? { ...item, ...note } : item))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async removeNote(id) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
      this.notes = this.notes.filter((item: SavedNote) => item.id !== id)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getNotes() {
    if (this.notes.length !== 0) {
      return
    }
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase
        .from('notes')
        .select('id, name, content')
        .eq('user_id', uid)
        .order('name')
      if (error) throw error
      this.notes = (data as NoteRow[]).map(toSavedNote)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
