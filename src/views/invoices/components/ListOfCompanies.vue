<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useInvoicesStore from '@/store/invoices'

const invoicesStore = useInvoicesStore()
const { companies } = storeToRefs(invoicesStore)
</script>

<template>
  <q-card v-for="item in companies" v-bind:key="item.id" class="companies-list q-mb-md q-pa-sm shadow-2">
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
    <q-card-section>
      <div v-if="item.registration" class="text-caption">Registrácia: {{ item.registration }}</div>
      <div v-if="item.businessReg" class="text-caption">Obch. register vl. č.:{{ item.businessReg }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat color="negative">Delete</q-btn>
      <q-btn flat color="primary">Edit</q-btn>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped>
.companies-list {
  .text-subtitle2 {
    color: var(--text-muted);
  }
}
</style>
