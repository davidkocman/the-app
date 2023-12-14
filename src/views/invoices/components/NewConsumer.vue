<script setup lang="ts">
import { ref } from 'vue'
import useInvoicesStore from '@/store/invoices'

// types
import type { Consumer } from '@/types/invoices'

const { addConsumer } = useInvoicesStore()

const fixed = ref(false)
const options = ref(['Slovakia', 'Czechia'])

const newConsumer = ref<Consumer>({
  name: '',
  street: '',
  zip: '',
  city: '',
  country: '',
  companyId: '',
  taxId: '',
  vatId: ''
})
const isVatPayer = ref(false)

const clearForm = () => {
  newConsumer.value = {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
    companyId: '',
    taxId: '',
    vatId: ''
  }
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="New Consumer" color="primary" @click="fixed = true" />

    <q-dialog v-model="fixed" persistent>
      <q-card style="min-width: 320px; width: 80vw">
        <q-card-section>
          <div class="text-h6">New Consumer</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll q-gutter-md">
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newConsumer.name" label="Name" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newConsumer.street" label="Street" />
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <q-input outlined dense v-model="newConsumer.zip" label="ZIP" />
            </div>
            <div class="col-8 q-pl-sm">
              <q-input outlined dense v-model="newConsumer.city" label="City" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-select outlined dense v-model="newConsumer.country" :options="options" label="Country" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll q-gutter-md">
          <div class="row">
            <div class="col-6">
              <q-input outlined dense v-model="newConsumer.companyId" label="Company ID" />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input outlined dense v-model="newConsumer.taxId" label="Tax ID" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-checkbox v-model="isVatPayer" label="Has VAT ID?" />
            </div>
          </div>
          <div v-if="isVatPayer" class="row">
            <div class="col">
              <q-input outlined dense v-model="newConsumer.vatId" label="Vat ID" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="clearForm" />
          <q-btn label="Save" color="primary" v-close-popup @click="addConsumer(newConsumer)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss"></style>
