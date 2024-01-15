<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMeta } from 'quasar'
import useInvoicesStore from '@/store/invoices'

const invoicesStore = useInvoicesStore()

import NewCompany from './components/NewCompany.vue'
import NewInvoice from './components/NewInvoice.vue'

const pageTitle = ref('Invoices | The App')
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

onMounted(async () => {
  await invoicesStore.getCompanies()
})
</script>

<template>
  <q-page class="page-invoices q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Invoices</h6>
      <NewCompany />
    </div>
    <div class="row">
      <div class="col">
        <NewInvoice />
      </div>
    </div>
  </q-page>
</template>
