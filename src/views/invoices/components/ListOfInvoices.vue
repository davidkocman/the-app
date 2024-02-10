<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

// types
import type { SavedInvoice, InvoiceItem } from '@/types/invoices'

const invoicesStore = useInvoicesStore()
const { companies, invoices } = storeToRefs(invoicesStore)

const getConsumerName = (item: SavedInvoice) => {
  const entry = companies.value.find((x) => x.id === item.consumerId)
  return entry ? entry.name : 'Consumer removed'
}
const getSum = (item: SavedInvoice) => {
  let sum = 0
  item.invoiceItems.forEach((item: InvoiceItem) => {
    sum = sum + item.vatPrice
  })
  return sum.toFixed(2)
}
</script>

<template>
  <template v-if="invoices.length">
    <q-card v-for="item in invoices" v-bind:key="item.id" class="invoices-list q-mb-md q-pa-sm shadow-2">
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col">
            <div class="text-h6">{{ getConsumerName(item) }}</div>
            <div class="text-subtitle2">{{ item.variableSymbol }}</div>
          </div>
          <div class="col">
            <div class="text-h6">{{ getSum(item) }} EUR</div>
          </div>
        </div>
      </q-card-section>
      <!-- <q-separator inset />
      <q-card-actions align="right">
        <RemoveComapny :company="item" />
        <EditCompany :company="item" />
      </q-card-actions> -->
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
