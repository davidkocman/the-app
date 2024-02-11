<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

// components
import InvoiceToPdf from './InvoiceToPdf.vue'
import RemoveInvoice from './RemoveInvoice.vue'

// types
import type { SavedInvoice, InvoiceItem } from '@/types/invoices'

const invoicesStore = useInvoicesStore()
const { companies, invoices } = storeToRefs(invoicesStore)

const consumerName = (item: SavedInvoice) => {
  const entry = companies.value.find((x) => x.id === item.consumer.id)
  return entry ? entry.name : 'N/A'
}
const totalVatPrice = (item: SavedInvoice) => {
  let sum = 0
  item.invoiceItems.forEach((item: InvoiceItem) => {
    sum = sum + item.vatPrice
  })
  return sum.toFixed(2)
}
const totalBasePrice = (item: SavedInvoice) => {
  let sum = 0
  item.invoiceItems.forEach((item: InvoiceItem) => {
    sum = sum + item.price
  })
  return sum.toFixed(2)
}
const totalVat = (item: SavedInvoice) => {
  let basePrice = 0
  item.invoiceItems.forEach((item: InvoiceItem) => {
    basePrice = basePrice + item.price
  })
  return ((Number(basePrice) * item.invoiceItems[0].vatRate) / 100).toFixed(2)
}

// const tableHeaders = ref([
//   {
//     name: 'variableSymbol',
//     required: true,
//     label: 'Variable Symbol',
//     align: 'left',
//     field: 'variableSymbol',
//     sortable: false
//   },
//   { name: 'consumer', align: 'left', label: 'Consumer name', field: 'consumer' },
//   { name: 'totalPrice', align: 'left', label: 'Total price', field: 'totalPrice' },
//   { name: 'actions', label: '', field: 'actions' }
// ])

// type TableRows = {
//   variableSymbol: string
//   consumer: string
//   totalPrice: string
// }

// const tableRows = computed(() => {
//   const rows: TableRows | [] = []
//   const entry = {
//     variableSymbol: '',
//     consumer: '',
//     totalPrice: ''
//   }
//   if (invoices.value.length) {
//     const entry = {
//       variableSymbol: '',
//       consumer: '',
//       totalPrice: ''
//     }

//     invoices.value.forEach((item: Invoice) => {
//       entry.variableSymbol = item.variableSymbol
//       entry.consumer = item.consumer.name
//       let sum = 0
//       item.invoiceItems.forEach((itm: InvoiceItem) => {
//         sum = sum + itm.vatPrice
//       })
//       entry.totalPrice = sum.toFixed(2) + ' EUR'
//       rows.push(entry)
//     })
//     return rows
//   }
//   return entry
// })
</script>

<template>
  <template v-if="invoices.length">
    <q-card v-for="invoice in invoices" v-bind:key="invoice.id" class="invoices-list q-mb-md">
      <q-card-section>
        <!-- <q-table flat :rows="tableRows" :columns="tableHeaders" row-key="name" binary-state-sort>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td :props="props" key="actions"> act </q-td>
            </q-tr>
          </template>
        </q-table> -->
        <div class="row q-col-gutter-sm">
          <div class="col-8">
            <div class="text-h6">{{ consumerName(invoice) }}</div>
            <div class="text-subtitle2">{{ invoice.variableSymbol }}</div>
          </div>
          <div class="col-2 row items-center">
            <h4 v-for="(item, index) in invoice.invoiceItems" :key="index" class="text-subtitle2 text-weight-medium">
              {{ item.name }}
            </h4>
          </div>
          <div class="col-2 row items-center">
            <div class="text-h6">{{ totalVatPrice(invoice) }} EUR</div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <RemoveInvoice :invoice="invoice" />
        <InvoiceToPdf
          :variableSymbol="invoice.variableSymbol"
          :tableRows="invoice.invoiceItems"
          :totalVatPrice="totalVatPrice(invoice)"
          :supplier="invoice.supplier"
          :consumer="invoice.consumer"
          :basePrice="totalBasePrice(invoice)"
          :vat="totalVat(invoice)"
        />
      </q-card-actions>
    </q-card>
  </template>
  <template v-else>
    <q-card class="invoices-list q-mb-md q-pa-sm shadow-2">
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col text-center">No items</div>
        </div>
      </q-card-section>
    </q-card>
  </template>
</template>

<style lang="scss" scoped>
.invoices-list {
  background-color: var(--bg-base);
  .text-subtitle2 {
    color: var(--text-muted);
  }
}
</style>
