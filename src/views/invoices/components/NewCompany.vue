<script setup lang="ts">
import { ref } from 'vue'
import useInvoicesStore from '@/store/invoices'

// types
import type { Company } from '@/types/invoices'

const { addCompany } = useInvoicesStore()

const fixed = ref(false)
const options = ref(['Slovakia', 'Czechia'])

const newCompany = ref<Company>({
  name: '',
  street: '',
  zip: '',
  city: '',
  country: '',
  companyId: '',
  taxId: '',
  vatId: '',
  iban: '',
  swift: ''
})
const isVatPayer = ref(false)

const clearForm = () => {
  newCompany.value = {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
    companyId: '',
    taxId: '',
    vatId: '',
    iban: '',
    swift: ''
  }
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Add company" color="primary" icon="apartment" @click="fixed = true" />

    <q-dialog v-model="fixed" persistent>
      <q-card style="min-width: 320px; width: 80vw">
        <q-card-section>
          <div class="text-h6">Add company</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll q-gutter-md">
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newCompany.name" label="Name" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newCompany.street" label="Street" />
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <q-input outlined dense v-model="newCompany.zip" label="ZIP" />
            </div>
            <div class="col-8 q-pl-sm">
              <q-input outlined dense v-model="newCompany.city" label="City" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-select outlined dense v-model="newCompany.country" :options="options" label="Country" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll q-gutter-md">
          <div class="row">
            <div class="col-6">
              <q-input outlined dense v-model="newCompany.companyId" label="Company ID" />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input outlined dense v-model="newCompany.taxId" label="Tax ID" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-checkbox v-model="isVatPayer" label="Has VAT ID?" />
            </div>
          </div>
          <div v-if="isVatPayer" class="row">
            <div class="col">
              <q-input outlined dense v-model="newCompany.vatId" label="Vat ID" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll q-gutter-md">
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newCompany.iban" label="IBAN" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input outlined dense v-model="newCompany.swift" label="SWIFT" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="clearForm" />
          <q-btn label="Save" color="primary" v-close-popup @click="addCompany(newCompany)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss"></style>
