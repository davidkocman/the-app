import { Store } from 'pinia'
import type { Consumer, SavedConsumer } from '@/types/invoices'

type State = {
  consumers: Array<SavedConsumer>
}

type Getters = {}

type Actions = {
  addConsumer: (payload: Consumer) => Promise<void>
  getConsumers: () => Promise<void>
}

type InvoicesStore = Store<'invoices', State, Getters, Actions>

export { State, Getters, Actions, InvoicesStore }
