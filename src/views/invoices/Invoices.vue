<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useMeta } from 'quasar'

import useInvoicesStore from '@/store/invoices'

// components
import NewCompany from './components/NewCompany.vue'
import NewInvoice from './components/NewInvoice.vue'
import ListOfCompanies from './components/ListOfCompanies.vue'
import ListOfInvoices from './components/ListOfInvoices.vue'

const invoicesStore = useInvoicesStore()

const pageTitle = ref('Invoices | The App')
const tab = ref('listOfInvoices')

useMeta(() => {
  return {
    title: pageTitle.value,
    meta: {
      description: { name: 'description', content: 'Invoices' },
      keywords: { name: 'keywords', content: 'invoices, invoice, download' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
    }
  }
})

onBeforeMount(() => {
  invoicesStore.getCompanies()
  invoicesStore.getInvoices()
})
</script>

<template>
  <q-page class="page-invoices q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-lg">
      <h6 class="text-h6">Invoices</h6>
      <div class="row align-center justify-center q-gutter-sm">
        <NewInvoice />
        <NewCompany />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            align="left"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab name="listOfInvoices" label="Invoices" />
            <q-tab name="listOfCompanies" label="Companies" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab">
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
  </q-page>
</template>
