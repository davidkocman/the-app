<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'

// store
import useInvoicesStore from '@/store/invoices'

// composables
import useInvoiceToPdf from '@/composables/invoices/useInvoiceToPdf'

// components
import EditInvoice from './EditInvoice.vue'

// types
import type { InvoiceItem, Company, SavedInvoice } from '@/types/invoices'

type InvoiceActionsMenuProps = {
  invoice: SavedInvoice
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

const props = withDefaults(defineProps<InvoiceActionsMenuProps>(), {
  zeroVatRateValue: null
})

const {
  invoice,
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

const variableSymbol = computed(() => invoice.value.variableSymbol)

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

const { removeInvoice } = useInvoicesStore()
const editDialog = ref(false)
const removeDialog = ref(false)
</script>

<template>
  <q-btn flat round icon="more_vert" color="primary">
    <q-menu>
      <q-list style="min-width: 160px">
        <q-item clickable v-close-popup @click="generateInvoice">
          <q-item-section avatar>
            <q-icon name="remove_red_eye" color="primary" />
          </q-item-section>
          <q-item-section>Preview</q-item-section>
        </q-item>
        <q-item v-if="!invoice.isPayed" clickable v-close-popup @click="editDialog = true">
          <q-item-section avatar>
            <q-icon name="edit" color="primary" />
          </q-item-section>
          <q-item-section>Edit</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="removeDialog = true">
          <q-item-section avatar>
            <q-icon name="delete" color="negative" />
          </q-item-section>
          <q-item-section class="text-negative">Remove</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <EditInvoice v-model="editDialog" :invoice="invoice" />

  <q-dialog v-model="removeDialog" persistent>
    <q-card style="min-width: 320px; width: 80vw">
      <q-card-section>
        <div class="text-h6">Remove Invoice</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">Are you sure you want to remove this invoice?</div>
        </div>
        <div class="row">
          <div class="col text-center">
            <span class="text-subtitle2 text-weight-bold">FA{{ invoice.variableSymbol }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="removeDialog = false" />
        <q-btn label="Remove" color="negative" v-close-popup @click="removeInvoice(invoice.id)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
