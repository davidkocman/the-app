import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { addDoc, doc, collection, getDocs, query, where, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import { Loading, QSpinnerPuff as spinner } from 'quasar'
import getErrorMessage from '@/utils/handleCatchErrors'
import INewNote from '@/types/notes/INewNote'
import INote from '@/types/notes/INote'
import INoteResponse from '@/types/notes/INoteResponse'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as INoteResponse[] | []
  }),
  actions: {
    async saveNewNote(payload: INote) {
      const appStore = useAppStore()
      Loading.show({
        spinner: spinner,
        spinnerSize: 60
      })
      appStore.loading = true
      try {
        const newNote: INewNote = {
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
        Loading.hide()
        appStore.loading = false
      }
    },
    async editNote(id: string, content: string) {
      const appStore = useAppStore()
      Loading.show({
        spinner: spinner,
        spinnerSize: 60
      })
      appStore.loading = true
      try {
        const docRef = doc(db, 'notes', id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          throw new Error('There is no such note in DB!')
        }

        if (docSnap.data().user === auth.currentUser?.uid) {
          await updateDoc(docRef, {
            content: content
          })

          this.notes = this.notes.map((item: INoteResponse) => {
            return item.id === id ? { ...item, content: content } : item
          })
        } else {
          throw new Error('You are not a creator of this note!')
        }
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        Loading.hide()
        appStore.loading = false
      }
    },
    async removeNote(id: string) {
      const appStore = useAppStore()
      Loading.show({
        spinner: spinner,
        spinnerSize: 60
      })
      appStore.loading = true
      try {
        const docRef = doc(db, 'notes', id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          throw new Error('There is no such note in DB!')
        }
        if (docSnap.data().user === auth.currentUser?.uid) {
          await deleteDoc(docRef)
          this.notes = this.notes.filter((item: INoteResponse) => item.id !== id)
        } else {
          throw new Error('You are not a creator of this note!')
        }
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        Loading.hide()
        appStore.loading = false
      }
    },
    async getNotes() {
      const appStore = useAppStore()
      if (this.notes.length !== 0) {
        return
      }
      Loading.show({
        spinner: spinner,
        spinnerColor: 'primary',
        spinnerSize: 60
      })
      appStore.loading = true
      this.notes = []
      const q = query(collection(db, 'notes'), where('user', '==', auth.currentUser?.uid))
      try {
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((note) => {
          this.notes.push({
            id: note.id,
            ...note.data()
          })
        })
      } catch (e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        Loading.hide()
        appStore.loading = false
      }
    }
  }
})
