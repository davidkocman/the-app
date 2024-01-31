import { addDoc, doc, collection, getDocs, query, where, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
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
  async editCompany(id, company) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const docRef = doc(db, 'companies', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('There is no such company in DB!')
      }

      const payload: Company = {
        name: company.name,
        street: company.street,
        zip: company.zip,
        city: company.city,
        country: company.country,
        companyId: company.companyId,
        taxId: company.taxId,
        iban: company.iban,
        swift: company.swift,
        registration: company.registration,
        businessReg: company.businessReg
      }
      if (company.vatId) payload.vatId = company.vatId

      if (docSnap.data().user === auth.currentUser?.uid) {
        await updateDoc(docRef, { ...payload })

        this.companies = this.companies.map((item: SavedCompany) => {
          return item.id === id ? { ...item, ...company } : item
        })
      } else {
        throw new Error('You are not a creator of this item!')
      }
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
