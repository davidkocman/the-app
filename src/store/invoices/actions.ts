import {
  addDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, InvoicesStore } from './types'
import type { Company, Invoice, SavedCompany, SavedInvoice } from '@/types/invoices'

export const actions: PiniaActionAdaptor<Actions, InvoicesStore> = {
  async saveCompany(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      payload.user = auth.currentUser?.uid
      const q = collection(db, 'companies')
      const docRef = await addDoc(q, payload)
      this.companies.push({ id: docRef.id, ...payload })
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async saveInvoice(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      payload.user = auth.currentUser?.uid
      const q = collection(db, 'invoices')
      const docRef = await addDoc(q, payload)
      this.invoices.push({ id: docRef.id, ...payload })
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async editCompany(company) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const docRef = doc(db, 'companies', company.id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        appStore.reportError({ message: 'There is no such company in DB!' })
        return
      }

      const payload: SavedCompany = {
        id: company.id,
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
          return item.id === company.id ? { ...item, ...company } : item
        })
      } else {
        appStore.reportError({ message: 'You are not a creator of this item!' })
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async removeCompany(id) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const docRef = doc(db, 'companies', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        appStore.reportError({ message: 'There is no such note in DB!' })
        return
      }
      if (docSnap.data().user === auth.currentUser?.uid) {
        await deleteDoc(docRef)
        this.companies = this.companies.filter((item: SavedCompany) => item.id !== id)
      } else {
        appStore.reportError({ message: 'You are not a creator of this note!' })
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async removeInvoice(id) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const docRef = doc(db, 'invoices', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        appStore.reportError({ message: 'There is no such note in DB!' })
        return
      }
      if (docSnap.data().user === auth.currentUser?.uid) {
        await deleteDoc(docRef)
        this.invoices = this.invoices.filter((item: SavedInvoice) => item.id !== id)
      } else {
        appStore.reportError({ message: 'You are not a creator of this note!' })
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async updateIsPayedStatus(id, invoice) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const docRef = doc(db, 'invoices', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        appStore.reportError({ message: 'There is no such invoice in DB!' })
        return
      }

      if (docSnap.data().user === auth.currentUser?.uid) {
        await updateDoc(docRef, {
          isPayed: invoice.isPayed
        })

        this.invoices = this.invoices.map((item: SavedInvoice) => {
          return item.id === id ? { ...item, ...invoice } : item
        })
      } else {
        appStore.reportError({ message: 'You are not a creator of this note!' })
      }
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getCompanies() {
    if (this.companies.length !== 0) {
      return
    }
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const q = query(collection(db, 'companies'), where('user', '==', auth.currentUser?.uid))
      const querySnapshot = await getDocs(q)
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
  },
  async getInvoices() {
    if (this.invoices.length !== 0) {
      return
    }
    const appStore = useAppStore()
    appStore.loading = true

    // Get current year date range
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0] // Jan 1
    const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0] // Jan 1 next year

    try {
      const q = query(
        collection(db, 'invoices'),
        where('user', '==', auth.currentUser?.uid),
        where('deliveryDate', '>=', startOfYear),
        where('deliveryDate', '<', endOfYear),
        orderBy('deliveryDate'),
        orderBy('variableSymbol', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const docs: SavedInvoice[] = []
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...(doc.data() as Invoice)
        })
      })
      this.invoices = docs
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  unlockInvoices(val) {
    if (val === import.meta.env.VITE_APP_INVOICE_PASSWORD) this.pageLocked = false
  }
}
