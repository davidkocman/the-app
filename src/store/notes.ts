import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { addDoc, collection, getDocs, query, where, DocumentReference, doc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import getErrorMessage from '@/utils/handleCatchErrors'
import INewNote from '@/types/INewNote'
import INote from '@/types/INote'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: []
  }),
  actions: {
    async saveNewNote(payload: INote) {
      const appStore = useAppStore()
      appStore.loading = true
      try {
        const newNote: INewNote = {
          name: payload.name,
          content: payload.content,
          user: auth.currentUser?.uid
        }
        const q = collection(db, 'notes')
        const docRef = await addDoc(q, newNote)
        this.notes.push({id: docRef.id, ...newNote})
        console.log(docRef.id)
      } catch(e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    },
    async editNote() {
      console.log('editing')
    },
    async removeNote() {
      console.log('removing')
    },
    async getNotes () {
      const appStore = useAppStore()
      if (this.notes.length !== 0 ) {
        return
      }
      appStore.loading = true
      this.notes = []
      const q = query(collection(db, 'notes'), where('user', '==', auth.currentUser?.uid))
      try {
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(note => {
          this.notes.push({
            id: note.id,
            ...note.data()
          })
        })
      } catch(e) {
        appStore.reportError({ message: getErrorMessage(e) })
      } finally {
        appStore.loading = false
      }
    }
  }
})
