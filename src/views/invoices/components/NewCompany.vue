<script setup lang="ts">
import { ref } from 'vue'
import useInvoicesStore from '@/store/invoices'

// types
import type { Company } from '@/types/invoices'

// utils
import { buttonLabel } from '@/utils/helpers'

const { saveCompany } = useInvoicesStore()

const dialog = ref(false)
const options = ref(['Slovenská republika', 'Česká republika'])

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
  swift: '',
  registration: '',
  businessReg: ''
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
    swift: '',
    registration: '',
    businessReg: ''
  }
}
</script>

<template>
  <q-btn :label="buttonLabel('New company')" color="primary" icon="apartment" @click="dialog = true" />

  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 320px; width: 80vw">
      <q-card-section>
        <div class="text-h6">New company</div>
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
            <q-checkbox v-model="isVatPayer" label="Is VAT payer?" />
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

      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="newCompany.registration" label="Registration" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="newCompany.businessReg" label="Business register" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup @click="clearForm" />
        <q-btn label="Save" color="primary" v-close-popup @click="saveCompany(newCompany)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss"></style>
