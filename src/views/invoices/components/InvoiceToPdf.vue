<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import useInvoiceToPdf from '@/composables/invoices/useInvoiceToPdf'

// types
import type { InvoiceItem, Company } from '@/types/invoices'

const props = defineProps({
  variableSymbol: {
    required: true,
    type: String
  },
  tableRows: {
    required: true,
    type: Object as PropType<InvoiceItem[]>
  },
  totalVatPrice: {
    required: true,
    type: String
  },
  supplier: {
    required: true,
    type: Object as PropType<Company>
  },
  consumer: {
    required: true,
    type: Object as PropType<Company>
  },
  basePrice: {
    required: true,
    type: String
  },
  vat: {
    required: true,
    type: String
  }
})

const { variableSymbol, tableRows, totalVatPrice, supplier, consumer, basePrice, vat } = toRefs(props)

const { generateInvoice } = useInvoiceToPdf(
  variableSymbol,
  tableRows,
  totalVatPrice,
  supplier,
  consumer,
  basePrice,
  vat
)
</script>

<template>
  <q-btn label="PDF" color="primary" icon="download" @click="generateInvoice"></q-btn>
</template>
