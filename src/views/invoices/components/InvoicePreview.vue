<script setup lang="ts">
import { toRefs } from 'vue'
import useInvoiceToPdf from '@/composables/invoices/useInvoiceToPdf'

// types
import type { InvoiceItem, Company } from '@/types/invoices'

type InvoicePreviewProps = {
  variableSymbol: string
  invoiceItems: Array<InvoiceItem>
  totalVatPrice: string
  supplier: Company
  consumer: Company
  issueDate: string
  deliveryDate: string
  dueDate: string
  basePrice: string
  vat: string
  zeroVatRateValue?: string | null
}

const props = withDefaults(defineProps<InvoicePreviewProps>(), {
  zeroVatRateValue: null
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
  vat,
  zeroVatRateValue
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
  vat,
  zeroVatRateValue
)
</script>

<template>
  <q-btn color="primary" icon="remove_red_eye" flat @click="generateInvoice"></q-btn>
</template>
