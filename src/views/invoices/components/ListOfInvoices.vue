<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

// components
import InvoiceToPdf from './InvoiceToPdf.vue'
import RemoveInvoice from './RemoveInvoice.vue'
import InvoiceIsPayed from './InvoiceIsPayed.vue'

// types
import type { SavedInvoice, InvoiceItem, Invoice } from '@/types/invoices'

const invoicesStore = useInvoicesStore()
const { invoices } = storeToRefs(invoicesStore)

const totalVatPrice = (item: SavedInvoice) => {
  let sum = 0
  item.invoiceItems.forEach((item: InvoiceItem) => {
    if (item.vatRate !== 0) {
      sum = sum + item.vatPrice
    } else {
      sum = sum + item.price
    }
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

type QuasarTableHeader = {
  name: string
  required?: boolean
  label: string
  align?: 'left' | 'center' | 'right'
  field: string
  sortable?: boolean
  style?: string
}

const tableHeaders = ref<QuasarTableHeader[]>([
  {
    name: 'variableSymbol',
    required: true,
    label: 'VS',
    align: 'left',
    field: 'variableSymbol',
    sortable: false,
    style: 'width: 150px'
  },
  { name: 'consumer', align: 'left', label: 'Consumer name', field: 'consumer', style: 'width: 250px' },
  { name: 'invoiceItems', align: 'left', label: 'Items', field: 'invoiceItems' },
  { name: 'deliveryDate', align: 'left', label: 'Delivery date', field: 'deliveryDate' },
  { name: 'totalPrice', align: 'left', label: 'Billed', field: 'totalPrice', style: 'width: 200px' },
  { name: 'vatRate', align: 'left', label: 'VAT (%)', field: 'vatRate', style: 'width: 200px' },
  { name: 'actions', label: '', field: 'actions', style: 'width: 100px' }
])

type TableRows = {
  variableSymbol: string
  consumer: string
  totalPrice: string
  vatRate: number
  deliveryDate: string
  zeroVatRateValue: string | null
}

const tableRows = computed(() => {
  const rows: TableRows[] = []
  invoices.value.forEach((item: Invoice) => {
    const entry: TableRows & { invoiceItems: InvoiceItem[] } = {
      variableSymbol: item.variableSymbol,
      consumer: item.consumer.name,
      totalPrice: '',
      vatRate: 0,
      invoiceItems: [],
      deliveryDate: new Date(item.deliveryDate).toLocaleDateString('sk'),
      zeroVatRateValue: item.zeroVatRateValue ?? null
    }
    let sum = 0
    item.invoiceItems.forEach((itm: InvoiceItem) => {
      if (itm.vatRate !== 0) {
        sum = sum + itm.vatPrice
      } else {
        sum = sum + itm.price
      }
      entry.invoiceItems.push(itm)
    })
    entry.totalPrice = sum.toFixed(2) + ' €'
    entry.vatRate = item.invoiceItems[0].vatRate
    rows.push(entry)
  })
  return rows
})
</script>

<template>
  <template v-if="invoices.length">
    <q-card class="invoices-list q-mb-md">
      <q-card-section class="q-pa-none">
        <q-table flat :rows="tableRows" :columns="tableHeaders" row-key="name" binary-state-sort>
          <template v-slot:body-cell-invoiceItems="props">
            <q-td key="invoiceItems" :props="props">
              <ol>
                <li v-for="item in props.row.invoiceItems" :key="item.name">{{ item.name }}</li>
              </ol>
            </q-td>
          </template>
          <!-- Table actions -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" key="actions">
              <div class="actions q-gutter-xs">
                <InvoiceIsPayed :invoice="invoices[tableRows.indexOf(props.row)]" />
                <InvoiceToPdf
                  :variableSymbol="invoices[tableRows.indexOf(props.row)].variableSymbol"
                  :invoiceItems="invoices[tableRows.indexOf(props.row)].invoiceItems"
                  :totalVatPrice="totalVatPrice(invoices[tableRows.indexOf(props.row)])"
                  :supplier="invoices[tableRows.indexOf(props.row)].supplier"
                  :consumer="invoices[tableRows.indexOf(props.row)].consumer"
                  :issueDate="invoices[tableRows.indexOf(props.row)].issueDate"
                  :deliveryDate="invoices[tableRows.indexOf(props.row)].deliveryDate"
                  :dueDate="invoices[tableRows.indexOf(props.row)].dueDate"
                  :basePrice="totalBasePrice(invoices[tableRows.indexOf(props.row)])"
                  :vat="totalVat(invoices[tableRows.indexOf(props.row)])"
                  :zeroVatRateValue="invoices[tableRows.indexOf(props.row)].zeroVatRateValue"
                />
                <RemoveInvoice :invoice="invoices[tableRows.indexOf(props.row)]" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
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
}
</style>
