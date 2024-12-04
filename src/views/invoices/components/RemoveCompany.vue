<script setup lang="ts">
import { ref, PropType } from 'vue'
import useInvoicesStore from '@/store/invoices'

// types
import type { SavedCompany } from '@/types/invoices'

defineProps({
  company: {
    required: true,
    type: Object as PropType<SavedCompany>
  }
})

const { removeCompany } = useInvoicesStore()

const dialog = ref(false)
</script>

<template>
  <q-btn label="" color="negative" icon="delete" flat @click="dialog = true" />
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 320px; width: 80vw">
      <q-card-section>
        <div class="text-h6">Remove company</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll q-gutter-md">
        <div class="row">
          <div class="col">Are you sure you want to remove this company?</div>
        </div>
        <div class="row">
          <div class="col text-center">
            <span class="text-subtitle2 text-weight-bold">{{ company.name }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="dialog = false" />
        <q-btn label="Remove" color="negative" v-close-popup @click="removeCompany(company.id)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
