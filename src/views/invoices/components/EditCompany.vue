<script setup lang="ts">
import { ref, toRef, PropType } from 'vue'
import useInvoicesStore from '@/store/invoices'

// types
import type { SavedCompany } from '@/types/invoices'

const props = defineProps({
  company: {
    required: true,
    type: Object as PropType<SavedCompany>
  }
})

const { editCompany } = useInvoicesStore()

const company = toRef(props, 'company')
const isVatPayer = ref(!!company.value.vatId)
const options = ref(['Slovenská republika', 'Česká republika'])
const dialog = ref(false)
</script>

<template>
  <q-btn label="Edit" color="primary" @click="dialog = true" />
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 320px; width: 80vw">
      <q-card-section>
        <div class="text-h6">Edit company</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.name" label="Name" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.street" label="Street" />
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <q-input outlined dense v-model="company.zip" label="ZIP" />
          </div>
          <div class="col-8 q-pl-sm">
            <q-input outlined dense v-model="company.city" label="City" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select outlined dense v-model="company.country" :options="options" label="Country" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col-6">
            <q-input outlined dense v-model="company.companyId" label="Company ID" />
          </div>
          <div class="col-6 q-pl-sm">
            <q-input outlined dense v-model="company.taxId" label="Tax ID" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-checkbox v-model="isVatPayer" label="Is VAT payer?" />
          </div>
        </div>
        <div v-if="isVatPayer" class="row">
          <div class="col">
            <q-input outlined dense v-model="company.vatId" label="Vat ID" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.iban" label="IBAN" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.swift" label="SWIFT" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.registration" label="Registration" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input outlined dense v-model="company.businessReg" label="Business register" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="dialog = false" />
        <q-btn label="Save" color="primary" v-close-popup @click="editCompany(company)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
