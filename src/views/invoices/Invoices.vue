<script setup lang="ts">
import { ref, watch, onBeforeMount, toRefs, WatchOptions } from 'vue'
import { useMeta } from 'quasar'

import useInvoicesStore from '@/store/invoices'

// components
import NewCompany from './components/NewCompany.vue'
import NewInvoice from './components/NewInvoice.vue'
import ListOfCompanies from './components/ListOfCompanies.vue'
import ListOfInvoices from './components/ListOfInvoices.vue'

// utils
import { thousandSeparator } from '@/utils/helpers'

const invoicesStore = useInvoicesStore()
const { pageLocked, totalInvoicesVatPrice, totalInvoicesPrice, totalPayedInvoicesVatPrice, totalPayedInvoicesPrice } =
  toRefs(invoicesStore)

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
    <template v-if="pageLocked">
      <q-dialog v-model="pageLocked" seamless>
        <q-card style="min-width: 350px">
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
      <div class="row justify-between items-center q-mb-lg">
        <h6 class="text-h6">Invoices</h6>
        <div class="row align-center justify-center q-gutter-sm">
          <q-btn v-if="!pageLocked" flat round color="primary" icon="lock" @click="pageLocked = true" />
          <NewInvoice />
          <NewCompany />
        </div>
      </div>
      <div
        v-if="totalInvoicesVatPrice && totalInvoicesPrice && totalPayedInvoicesVatPrice && totalPayedInvoicesPrice"
        class="q-mb-lg"
      >
        <div class="column items-end q-gutter-xs">
          <q-card class="shadow-1">
            <q-card-section>
              <div v-if="totalInvoicesVatPrice !== totalPayedInvoicesVatPrice" class="q-pb-sm">
                <h6 class="text-orange-5">Billed: {{ thousandSeparator(totalInvoicesVatPrice.toFixed(2)) }} €</h6>
                <span class="text-caption text-orange-5">
                  {{ thousandSeparator(totalInvoicesPrice.toFixed(2)) }} € without VAT</span
                >
              </div>
              <q-separator v-if="totalInvoicesVatPrice !== totalPayedInvoicesVatPrice" />
              <div>
                <h6 class="text-primary">Payed: {{ thousandSeparator(totalPayedInvoicesVatPrice.toFixed(2)) }} €</h6>
                <span class="text-caption text-primary"
                  >{{ thousandSeparator(totalPayedInvoicesPrice.toFixed(2)) }} € without VAT</span
                >
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-card>
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
