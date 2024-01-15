import { addDoc, doc, collection, getDocs, query, where, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, InvoicesStore } from './types'
import { Company, SavedCompany } from '@/types/invoices'

export const actions: PiniaActionAdaptor<Actions, InvoicesStore> = {
  async addCompany(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const q = collection(db, 'companies')
      const docRef = await addDoc(q, payload)
      this.companies.push({ id: docRef.id, ...payload })
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getCompanies() {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const querySnapshot = await getDocs(collection(db, 'companies'))
      const docs: SavedCompany[] = []
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...(doc.data() as Company)
        })
      })
      this.companies = docs
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  }
}
