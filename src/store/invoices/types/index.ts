import { Store } from 'pinia'
import type { Company, SavedCompany } from '@/types/invoices'

type State = {
  consumers: Array<SavedCompany>
}

type Getters = {}

type Actions = {
  addConsumer: (payload: Company) => Promise<void>
  getConsumers: () => Promise<void>
}

type InvoicesStore = Store<'invoices', State, Getters, Actions>

export { State, Getters, Actions, InvoicesStore }
