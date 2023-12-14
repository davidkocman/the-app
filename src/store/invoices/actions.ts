import { addDoc, doc, collection, getDocs, query, where, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, InvoicesStore } from './types'
import { Consumer, SavedConsumer } from '@/types/invoices'

export const actions: PiniaActionAdaptor<Actions, InvoicesStore> = {
  async addConsumer(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const q = collection(db, 'consumers')
      const docRef = await addDoc(q, payload)
      this.consumers.push({ id: docRef.id, ...payload })
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getConsumers() {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const querySnapshot = await getDocs(collection(db, 'consumers'))
      const docs: SavedConsumer[] = []
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...(doc.data() as Consumer)
        })
      })
      this.consumers = docs
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
