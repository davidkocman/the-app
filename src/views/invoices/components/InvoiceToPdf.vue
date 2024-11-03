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
  invoiceItems: {
    required: true,
    type: Object as PropType<Array<InvoiceItem>>
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
  issueDate: {
    required: true,
    type: String
  },
  deliveryDate: {
    required: true,
    type: String
  },
  dueDate: {
    required: true,
    type: String
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

const {
  variableSymbol,
  invoiceItems,
  totalVatPrice,
  supplier,
  consumer,
  issueDate,
  deliveryDate,
  dueDate,
  basePrice,
  vat
} = toRefs(props)

const { generateInvoice } = useInvoiceToPdf(
  variableSymbol,
  invoiceItems,
  totalVatPrice,
  supplier,
  consumer,
  issueDate,
  deliveryDate,
  dueDate,
  basePrice,
  vat
)
</script>

<template>
  <q-btn color="primary" icon="download" flat @click="generateInvoice"></q-btn>
</template>
