import type { PiniaGetterAdaptor } from '@/types/store'
import type { Getters, InvoicesStore } from './types'
import type { SavedInvoice } from '@/types/invoices'

export const getters: PiniaGetterAdaptor<Getters, InvoicesStore> = {
  totalInvoicesPrice() {
    if (this.invoices.length) {
      let sum = 0
      this.invoices
        .filter((invoice: SavedInvoice) => {
          const year = new Date(invoice.deliveryDate).getFullYear()
          if (year !== this.selectedYear) return false
          if (this.selectedConsumer !== null && invoice.consumer.name !== this.selectedConsumer) return false
          return true
        })
        .forEach((invoice: SavedInvoice) => {
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
      this.invoices
        .filter((invoice: SavedInvoice) => {
          const year = new Date(invoice.deliveryDate).getFullYear()
          if (year !== this.selectedYear) return false
          if (this.selectedConsumer !== null && invoice.consumer.name !== this.selectedConsumer) return false
          return true
        })
        .forEach((invoice: SavedInvoice) => {
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
      this.invoices
        .filter((invoice: SavedInvoice) => {
          const year = new Date(invoice.deliveryDate).getFullYear()
          if (year !== this.selectedYear) return false
          if (this.selectedConsumer !== null && invoice.consumer.name !== this.selectedConsumer) return false
          return true
        })
        .forEach((invoice: SavedInvoice) => {
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
      this.invoices
        .filter((invoice: SavedInvoice) => {
          const year = new Date(invoice.deliveryDate).getFullYear()
          if (year !== this.selectedYear) return false
          if (this.selectedConsumer !== null && invoice.consumer.name !== this.selectedConsumer) return false
          return true
        })
        .forEach((invoice: SavedInvoice) => {
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
