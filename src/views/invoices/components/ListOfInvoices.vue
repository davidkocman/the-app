<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

// components
import InvoiceToPdf from './InvoiceToPdf.vue'

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
    // ((Number(basePrice.value) * tableRows.value[0].vatRate) / 100).toFixed(2)
    basePrice = basePrice + item.price
  })
  return ((Number(basePrice) * item.invoiceItems[0].vatRate) / 100).toFixed(2)
}
</script>

<template>
  <template v-if="invoices.length">
    <q-card v-for="item in invoices" v-bind:key="item.id" class="invoices-list q-mb-md q-pa-sm shadow-2">
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col">
            <div class="text-h6">{{ consumerName(item) }}</div>
            <div class="text-subtitle2">{{ item.variableSymbol }}</div>
          </div>
          <div class="col">
            <div class="text-h6">{{ totalVatPrice(item) }} EUR</div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <InvoiceToPdf
          :variableSymbol="item.variableSymbol"
          :tableRows="item.invoiceItems"
          :totalVatPrice="totalVatPrice(item)"
          :supplier="item.supplier"
          :consumer="item.consumer"
          :basePrice="totalBasePrice(item)"
          :vat="totalVat(item)"
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
