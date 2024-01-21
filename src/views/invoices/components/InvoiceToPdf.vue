<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import useInvoiceToPdf from '@/composables/invoices/useInvoiceToPdf'

// types
import type { InvoiceItem } from '@/types/invoices'

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
  iban: {
    required: true,
    type: String
  },
  swift: {
    required: true,
    type: String
  }
})

const { tableRows, totalVatPrice, iban, swift, variableSymbol } = toRefs(props)

const { generateInvoice } = useInvoiceToPdf(variableSymbol, tableRows, totalVatPrice, iban, swift)
</script>

<template>
  <q-btn label="Download invoice" @click="generateInvoice"></q-btn>
</template>
@/composables/invoices/useInvoiceToPdf
