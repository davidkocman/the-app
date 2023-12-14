<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMeta } from 'quasar'
import useInvoicesStore from '@/store/invoices'

const invoicesStore = useInvoicesStore()

import NewConsumer from './components/NewConsumer.vue'

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
  await invoicesStore.getConsumers()
})
</script>

<template>
  <q-page class="page-invoices q-py-md q-px-lg">
    <div class="row justify-between items-center q-mb-sm">
      <h6 class="text-h6">Invoices</h6>
      <NewConsumer />
    </div>
  </q-page>
</template>
