import { addDoc, doc, collection, getDocs, query, where, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, NotesStore } from './types'
import type { NoteResponse, NewNote } from '@/types/notes'

export const actions: PiniaActionAdaptor<Actions, NotesStore> = {
  async saveNewNote(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const newNote: NewNote = {
        name: payload.name,
        content: payload.content,
        user: auth.currentUser?.uid
      }
      const q = collection(db, 'notes')
      const docRef = await addDoc(q, newNote)
      this.notes.push({ id: docRef.id, ...newNote })
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
      const docRef = doc(db, 'notes', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('There is no such note in DB!')
      }

      if (docSnap.data().user === auth.currentUser?.uid) {
        await updateDoc(docRef, {
          name: note.name,
          content: note.content
        })

        this.notes = this.notes.map((item: NoteResponse) => {
          return item.id === id ? { ...item, content: note.content, name: note.name } : item
        })
      } else {
        throw new Error('You are not a creator of this note!')
      }
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
      const docRef = doc(db, 'notes', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('There is no such note in DB!')
      }
      if (docSnap.data().user === auth.currentUser?.uid) {
        await deleteDoc(docRef)
        this.notes = this.notes.filter((item: NoteResponse) => item.id !== id)
      } else {
        throw new Error('You are not a creator of this note!')
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getNotes() {
    const appStore = useAppStore()
    if (this.notes.length !== 0) {
      return
    }
    appStore.loading = true
    this.notes = []
    const q = query(collection(db, 'notes'), where('user', '==', auth.currentUser?.uid))
    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((note) => {
        this.notes.push({
          id: note.id,
          ...(note.data() as NewNote)
        })
      })
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
