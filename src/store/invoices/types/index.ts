import { Store } from 'pinia'
import type { Company, Invoice, SavedCompany, SavedInvoice } from '@/types/invoices'

type State = {
  companies: Array<SavedCompany> | []
  invoices: Array<SavedInvoice> | []
  pageLocked: boolean
}

type Getters = {
  totalInvoicesPrice: number | null
  totalInvoicesVatPrice: number | null
  totalPayedInvoicesPrice: number | null
  totalPayedInvoicesVatPrice: number | null
}

type Actions = {
  saveCompany: (payload: Company) => Promise<void>
  saveInvoice: (payload: Invoice) => Promise<void>
  removeInvoice: (id: string) => Promise<void>
  editCompany: (company: SavedCompany) => Promise<void>
  removeCompany: (id: string) => Promise<void>
  getCompanies: () => Promise<void>
  getInvoices: () => Promise<void>
  updateIsPayedStatus: (id: string, invoice: SavedInvoice) => Promise<void>
  unlockInvoices: (val: string) => void
}

type InvoicesStore = Store<'invoices', State, Getters, Actions>

export type { State, Getters, Actions, InvoicesStore }
