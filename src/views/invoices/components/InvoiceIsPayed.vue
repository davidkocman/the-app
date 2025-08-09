<script setup lang="ts">
import { PropType, toRef } from 'vue'

import useInvoicesStore from '@/store/invoices'

// types
import type { SavedInvoice } from '@/types/invoices'

const props = defineProps({
  invoice: {
    required: true,
    type: Object as PropType<SavedInvoice>,
    default: () => {
      false
    }
  }
})

const invoiceStore = useInvoicesStore()

const invoice = toRef(props, 'invoice')
</script>

<template>
  <q-checkbox
    left-label
    v-model="invoice.isPayed"
    label="Payed"
    @update:model-value="invoiceStore.updateIsPayedStatus(invoice.id, invoice)"
  />
</template>
