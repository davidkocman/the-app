import { defineStore } from 'pinia'
// import getErrorMessage from '@/utils/handleCatchErrors'
// import { addDoc } from 'firebase/firestore'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: []
  }),
  actions: {
    async saveNewNote(payload: string) {
      console.log('saving')
    },
    async editNote() {
      console.log('editing')
    },
    async removeNote() {
      console.log('removing')
    }
  }
})
