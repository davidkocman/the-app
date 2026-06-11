<script setup lang="ts">
import { ref, computed, watch, onBeforeMount, toRefs, WatchOptions } from 'vue'
import { useMeta, useQuasar } from 'quasar'

// store
import useInvoicesStore from '@/store/invoices'

// components
import NewCompany from './components/NewCompany.vue'
import NewInvoice from './components/NewInvoice.vue'
import ListOfCompanies from './components/ListOfCompanies.vue'
import ListOfInvoices from './components/ListOfInvoices.vue'

// utils
import { thousandSeparator } from '@/utils/helpers'

const $q = useQuasar()
const invoicesStore = useInvoicesStore()
const { pageLocked, totalInvoicesVatPrice, totalInvoicesPrice, totalPayedInvoicesVatPrice, totalPayedInvoicesPrice } =
  toRefs(invoicesStore)

// Outstanding = billed − paid (the still-unpaid amount), with and without VAT.
const hasSummary = computed(
  () =>
    totalInvoicesVatPrice.value !== null &&
    totalInvoicesPrice.value !== null &&
    totalPayedInvoicesVatPrice.value !== null &&
    totalPayedInvoicesPrice.value !== null
)
const outstandingVatPrice = computed(() => (totalInvoicesVatPrice.value ?? 0) - (totalPayedInvoicesVatPrice.value ?? 0))
const outstandingPrice = computed(() => (totalInvoicesPrice.value ?? 0) - (totalPayedInvoicesPrice.value ?? 0))

const pageTitle = ref('Invoices | The App')
const activeTab = ref('listOfInvoices')
const enteredCode = ref('')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Invoices' },
      keywords: { name: 'keywords', content: 'invoices, invoice, download, companies' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

watch(
  pageLocked,
  (val) => {
    if (!val) {
      invoicesStore.getCompanies()
      invoicesStore.getInvoices()
    }
  },
  { once: true } as WatchOptions
)

onBeforeMount(() => {
  if (!pageLocked.value) {
    invoicesStore.getCompanies()
    invoicesStore.getInvoices()
  }
})
</script>

<template>
  <q-page class="page-invoices q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-md">
      <h1 class="text-h4 q-my-none flex items-center" style="gap: 10px"><q-icon name="description" />Invoices</h1>
      <div v-if="!pageLocked" class="row align-center justify-center q-gutter-sm">
        <q-btn flat round color="primary" icon="lock" @click="pageLocked = true" />
        <NewInvoice />
        <NewCompany />
      </div>
    </div>
    <template v-if="pageLocked">
      <q-dialog v-model="pageLocked" seamless>
        <q-card flat style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Page locked</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="enteredCode"
              autofocus
              type="password"
              @keyup.enter=";[invoicesStore.unlockInvoices(enteredCode), (enteredCode = '')]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Submit" @click="invoicesStore.unlockInvoices(enteredCode)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
    <template v-else>
      <div v-if="hasSummary" class="invoices-summary row items-center justify-end q-mb-md q-px-xs">
        <div class="summary-metric column">
          <span class="summary-label text-grey-7">Billed</span>
          <div class="summary-amounts row items-baseline">
            <span class="summary-value">{{ thousandSeparator(totalInvoicesVatPrice!.toFixed(2)) }} €</span>
            <span class="summary-net text-grey-6"
              >{{ thousandSeparator(totalInvoicesPrice!.toFixed(2)) }} € without VAT</span
            >
          </div>
        </div>
        <q-separator :vertical="$q.screen.gt.xs" />
        <div class="summary-metric column">
          <span class="summary-label text-grey-7">Paid</span>
          <div class="summary-amounts row items-baseline">
            <span class="summary-value text-primary"
              >{{ thousandSeparator(totalPayedInvoicesVatPrice!.toFixed(2)) }} €</span
            >
            <span class="summary-net text-grey-6"
              >{{ thousandSeparator(totalPayedInvoicesPrice!.toFixed(2)) }} € without VAT</span
            >
          </div>
        </div>
        <q-separator :vertical="$q.screen.gt.xs" />
        <div class="summary-metric column">
          <span class="summary-label text-grey-7">Outstanding</span>
          <div class="summary-amounts row items-baseline">
            <span class="summary-value" :class="outstandingVatPrice > 0 ? 'text-orange-7' : 'text-positive'"
              >{{ thousandSeparator(outstandingVatPrice.toFixed(2)) }} €</span
            >
            <span class="summary-net text-grey-6">{{ thousandSeparator(outstandingPrice.toFixed(2)) }} € without VAT</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-card flat>
            <q-tabs
              v-model="activeTab"
              dense
              inline-label
              class="text-grey"
              align="left"
              active-color="primary"
              indicator-color="primary"
              narrow-indicator
            >
              <q-tab name="listOfInvoices" label="Invoices" icon="description" />
              <q-tab name="listOfCompanies" label="Companies" icon="apartment" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="activeTab">
              <q-tab-panel name="listOfInvoices">
                <ListOfInvoices />
              </q-tab-panel>
              <q-tab-panel name="listOfCompanies">
                <ListOfCompanies />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<style lang="scss" scoped>
.page-invoices {
  padding-left: 6px;
  padding-right: 6px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.invoices-summary {
  gap: 8px 24px;

  .summary-metric {
    line-height: 1.25;
  }

  .summary-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .summary-amounts {
    column-gap: 6px;
  }

  .summary-value {
    font-size: 1.05rem;
    font-weight: 600;
  }

  .summary-net {
    font-size: 0.75rem;
  }

  .q-separator--vertical {
    align-self: stretch;
    height: auto;
  }

  // Mobile (Quasar xs): stack metrics as a full-width list —
  // label on the left, amounts right-aligned, with horizontal dividers.
  @media (max-width: 599px) {
    align-items: stretch;

    .summary-metric {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
    }

    .summary-amounts {
      flex-direction: column;
      align-items: flex-end;
      column-gap: 0;
      text-align: right;
    }
  }
}
</style>
