<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

import EditCompany from './EditCompany.vue'
import RemoveCompany from './RemoveCompany.vue'

const invoicesStore = useInvoicesStore()
const { companies } = storeToRefs(invoicesStore)
</script>

<template>
  <q-card v-for="item in companies" v-bind:key="item.id" class="companies-list q-mb-md q-pa-sm shadow-0">
    <q-card-section>
      <div class="text-h6 q-mb-sm">{{ item.name }}</div>
      <div class="text-subtitle2">IČO: {{ item.companyId }}</div>
      <div class="text-subtitle2">DIČ: {{ item.taxId }}</div>
      <div v-if="item.vatId" class="text-subtitle2">IČ DPH: {{ item.vatId }}</div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <div class="text-body2">{{ item.street }}</div>
      <div class="text-body2">{{ item.zip }}, {{ item.city }}</div>
      <div class="text-body2">{{ item.country }}</div>
    </q-card-section>
    <q-card-section v-if="item.iban || item.swift">
      <div v-if="item.iban" class="text-body2">
        <span class="text-subtitle2">IBAN:</span> {{ item.iban.match(/.{1,4}/g)?.join(' ') }}
      </div>
      <div v-if="item.swift" class="text-body2"><span class="text-subtitle2">SWIFT:</span> {{ item.swift }}</div>
    </q-card-section>
    <q-card-section>
      <div v-if="item.registration" class="text-caption">Registrácia: {{ item.registration }}</div>
      <div v-if="item.businessReg" class="text-caption">Obch. register vl. č.:{{ item.businessReg }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <RemoveCompany :company="item" />
      <EditCompany :company="item" />
    </q-card-actions>
    <div class="bg-icon absolute">
      <q-icon name="apartment" size="6rem" />
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.companies-list {
  background-color: var(--bg-base);
  .text-subtitle2 {
    color: var(--text-muted);
  }
  .bg-icon {
    top: 16px;
    right: 16px;
    opacity: 0.05;
  }
}
</style>
