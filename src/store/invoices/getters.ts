import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, InvoicesStore } from './types'

export const getters: PiniaGetterAdaptor<Getters, InvoicesStore> = {
  totalInvoicesPrice() {
    if (this.invoices.length) {
      let sum = 0
      this.invoices.forEach((invoice) => {
        invoice.invoiceItems.forEach((item) => {
          sum = sum + item.price
        })
      })
      return sum
    }
    return null
  },
  totalInvoicesVatPrice() {
    if (this.invoices.length) {
      let sum = 0
      this.invoices.forEach((invoice) => {
        invoice.invoiceItems.forEach((item) => {
          if (item.vatPrice !== 0) {
            sum = sum + item.vatPrice
          } else {
            sum = sum + item.price
          }
        })
      })
      return sum
    }
    return null
  },
  totalPayedInvoicesPrice() {
    if (this.invoices.length) {
      let sum = 0
      this.invoices.forEach((invoice) => {
        if (invoice.isPayed) {
          invoice.invoiceItems.forEach((item) => {
            sum = sum + item.price
          })
        }
      })
      return sum
    }
    return null
  },
  totalPayedInvoicesVatPrice() {
    if (this.invoices.length) {
      let sum = 0
      this.invoices.forEach((invoice) => {
        if (invoice.isPayed) {
          invoice.invoiceItems.forEach((item) => {
            if (item.vatPrice !== 0) {
              sum = sum + item.vatPrice
            } else {
              sum = sum + item.price
            }
          })
        }
      })
      return sum
    }
    return null
  }
}
