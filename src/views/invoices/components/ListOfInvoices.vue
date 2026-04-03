<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

// components
import InvoiceActionsMenu from './InvoiceActionsMenu.vue'
import InvoiceIsPayed from './InvoiceIsPayed.vue'

// types
import type { SavedInvoice, InvoiceItem } from '@/types/invoices'

const invoicesStore = useInvoicesStore()
const { invoices, selectedYear, selectedConsumer } = storeToRefs(invoicesStore)

const availableYears = computed(() => {
  const years = new Set<number>()
  invoices.value.forEach((inv) => years.add(new Date(inv.deliveryDate).getFullYear()))
  return Array.from(years).sort()
})

const availableConsumers = computed(() => {
  const names = new Set<string>()
  invoices.value.forEach((inv) => names.add(inv.consumer.name))
  return Array.from(names).sort()
})

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
  { name: 'vatAmount', align: 'left', label: 'VAT', field: 'vatAmount', style: 'width: 150px' },
  { name: 'vatRate', align: 'left', label: 'VAT (%)', field: 'vatRate', style: 'width: 200px' },
  { name: 'actions', label: '', field: 'actions', style: 'width: 100px' }
])

type TableRows = {
  variableSymbol: string
  consumer: string
  totalPrice: string
  vatAmount: string
  vatRate: number
  deliveryDate: string
  zeroVatRateValue: string | null
  invoiceItems: InvoiceItem[]
  originalInvoice: SavedInvoice
}

const tableRows = computed(() => {
  const rows: TableRows[] = []
  invoices.value
    .filter((item) => {
      const year = new Date(item.deliveryDate).getFullYear()
      if (year !== selectedYear.value) return false
      if (selectedConsumer.value !== null && item.consumer.name !== selectedConsumer.value) return false
      return true
    })
    .forEach((item: SavedInvoice) => {
      const entry: TableRows = {
        variableSymbol: item.variableSymbol,
        consumer: item.consumer.name,
        totalPrice: '',
        vatAmount: '',
        vatRate: 0,
        invoiceItems: [],
        deliveryDate: new Date(item.deliveryDate).toLocaleDateString('sk'),
        zeroVatRateValue: item.zeroVatRateValue ?? null,
        originalInvoice: item
      }
      let sum = 0
      let baseSum = 0
      item.invoiceItems.forEach((itm: InvoiceItem) => {
        if (itm.vatRate !== 0) {
          sum = sum + itm.vatPrice
        } else {
          sum = sum + itm.price
        }
        baseSum = baseSum + itm.price
        entry.invoiceItems.push(itm)
      })
      entry.totalPrice = sum.toFixed(2) + ' €'
      entry.vatAmount = (sum - baseSum).toFixed(2) + ' €'
      entry.vatRate = item.invoiceItems[0].vatRate
      rows.push(entry)
    })
  return rows
})
</script>

<template>
  <template v-if="invoices.length">
    <q-card class="invoices-list q-mb-md">
      <q-card-section class="q-p-md">
        <div class="row q-gutter-sm items-center">
          <q-select
            v-model="selectedYear"
            :options="availableYears"
            label="Year"
            dense
            outlined
            style="min-width: 120px"
          />
          <q-select
            v-model="selectedConsumer"
            :options="availableConsumers"
            label="Consumer"
            clearable
            dense
            outlined
            style="min-width: 220px"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <template v-if="tableRows.length">
          <q-table
            flat
            :rows="tableRows"
            :columns="tableHeaders"
            row-key="name"
            binary-state-sort
            :rows-per-page-options="[0, 12, 24, 32]"
          >
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
                  <InvoiceIsPayed :invoice="props.row.originalInvoice" />
                  <InvoiceActionsMenu
                    :invoice="props.row.originalInvoice"
                    :invoiceItems="props.row.originalInvoice.invoiceItems"
                    :totalVatPrice="totalVatPrice(props.row.originalInvoice)"
                    :supplier="props.row.originalInvoice.supplier"
                    :consumer="props.row.originalInvoice.consumer"
                    :issueDate="props.row.originalInvoice.issueDate"
                    :deliveryDate="props.row.originalInvoice.deliveryDate"
                    :dueDate="props.row.originalInvoice.dueDate"
                    :basePrice="totalBasePrice(props.row.originalInvoice)"
                    :vat="totalVat(props.row.originalInvoice)"
                    :zeroVatRateValue="props.row.originalInvoice.zeroVatRateValue"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </template>
        <template v-else>
          <q-card-section>
            <div class="row q-gutter-sm">
              <div class="col text-center">No items</div>
            </div>
          </q-card-section>
        </template>
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
