import { Store } from 'pinia'
import type { Company, SavedCompany } from '@/types/invoices'

type State = {
  companies: Array<SavedCompany>
}

type Getters = {}

type Actions = {
  addCompany: (payload: Company) => Promise<void>
  editCompany: (id: string, company: Company) => Promise<void>
  getCompanies: () => Promise<void>
}

type InvoicesStore = Store<'invoices', State, Getters, Actions>

export { State, Getters, Actions, InvoicesStore }
