import type { State } from './types'

export default function (): State {
  return {
    companies: [],
    invoices: [],
    pageLocked: true
  }
}
