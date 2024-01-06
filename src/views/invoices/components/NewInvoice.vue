<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import useInvoicesStore from '@/store/invoices'

// types
import type { SavedConsumer, InvoiceItem } from '@/types/invoices'

// helpers
import { calculateValueFromPercentage } from '@/utils/helpers'

const invoiceStore = useInvoicesStore()
const { consumers } = storeToRefs(invoiceStore)

const TODAY = new Date()
const YEAR = TODAY.getFullYear().toString().substring(2)
const MONTH = TODAY.getMonth() + 1
const DAY = TODAY.getDate()

const selectedConsumer = ref<SavedConsumer | null>(null)
const selectedSupplier = ref<SavedConsumer | null>(null)
const variableSymbol = ref(`${YEAR}${MONTH}01`)

const issueDate = ref(`${YEAR}/${MONTH}/${DAY}`)
const dueDate = ref(`${YEAR}/${MONTH}/${DAY}`)
const deliveryDate = ref('')
const index = ref(0)

const issueDateFormValue = computed(() => {
  return new Date(
    `${issueDate.value.split('/')[1]}/${issueDate.value.split('/')[2]}/${issueDate.value.split('/')[0]}`
  ).toLocaleDateString('sk')
})
const deliveryDateFormValue = computed(() => {
  return deliveryDate.value
    ? new Date(
        `${deliveryDate.value.split('/')[1]}/${deliveryDate.value.split('/')[2]}/${deliveryDate.value.split('/')[0]}`
      ).toLocaleDateString('sk')
    : ''
})
const dueDateFormValue = computed(() => {
  return dueDate.value
    ? new Date(
        `${dueDate.value.split('/')[1]}/${dueDate.value.split('/')[2]}/${dueDate.value.split('/')[0]}`
      ).toLocaleDateString('sk')
    : ''
})

const tableHeaders = ref([
  {
    name: 'name',
    required: true,
    label: 'Názov položky',
    align: 'left',
    field: 'name',
    sortable: false
  },
  { name: 'quantity', align: 'center', label: 'Množstvo', field: 'quantity' },
  { name: 'unit', align: 'center', label: 'MJ', field: 'unit' },
  { name: 'price', align: 'center', label: 'Cena bez DPH', field: 'price' },
  { name: 'vatRate', align: 'center', label: 'DPH%', field: 'vatRate' },
  { name: 'vatPrice', align: 'center', label: 'Spolu s DPH', field: 'vatPrice' }
])
const tableRows = ref<InvoiceItem[]>([
  {
    name: 'test',
    quantity: null,
    unit: null,
    price: 0,
    vatRate: 20,
    vatPrice: 0
  }
])

watch(
  () => tableRows,
  () => {
    calculateVatPrice()
  },
  {
    deep: true
  }
)

const calculateVatPrice = () => {
  if (Number(tableRows.value[index.value].quantity)) {
    tableRows.value[index.value].vatPrice =
      (Number(tableRows.value[index.value].price) +
        calculateValueFromPercentage(
          tableRows.value[index.value].vatRate,
          Number(tableRows.value[index.value].price)
        )) *
      Number(tableRows.value[index.value].quantity)
    return
  }
  tableRows.value[index.value].vatPrice =
    Number(tableRows.value[index.value].price) +
    calculateValueFromPercentage(tableRows.value[index.value].vatRate, Number(tableRows.value[index.value].price))
}
</script>

<template>
  <q-card flat bordered class="invoice-heading q-mb-md">
    <q-card-section>
      <div class="row q-mb-sm q-gutter-md">
        <div class="col">
          <q-select
            outlined
            v-model="selectedConsumer"
            :options="consumers"
            option-label="name"
            option-value="id"
            label="Odberateľ"
          />
        </div>
        <div class="col">
          <q-select
            outlined
            v-model="selectedSupplier"
            :options="consumers"
            option-label="name"
            option-value="id"
            label="Dodávateľ"
          />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col">
          <div v-if="selectedConsumer" class="consumer-details q-pl-sm">
            <h4 class="text-caption">
              {{ selectedConsumer.street }}
            </h4>
            <h4 class="text-caption">{{ selectedConsumer.zip }}, {{ selectedConsumer.city }}</h4>
            <h4 class="text-caption">
              {{ selectedConsumer.country }}
            </h4>
            <q-separator class="q-my-sm" />
            <h4 class="text-caption">
              IČO: <span class="text-subtitle2">{{ selectedConsumer.companyId }}</span>
            </h4>
            <h4 class="text-caption">
              DIČ: <span class="text-subtitle2">{{ selectedConsumer.taxId }}</span>
            </h4>
            <h4 v-if="selectedConsumer.vatId" class="text-caption">
              IČ DPH: <span class="text-subtitle2">{{ selectedConsumer.vatId }}</span>
            </h4>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row q-gutter-md">
        <div class="col">
          <div class="row q-gutter-md q-mb-md">
            <div class="col">
              <q-input outlined v-model="issueDateFormValue" label="Dátum vystavenia">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="issueDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input outlined v-model="deliveryDateFormValue" label="Dátum dodania">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="deliveryDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input outlined v-model="dueDateFormValue" label="Splatnosť">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dueDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-md q-mb-md">
            <div class="col">
              <q-input outlined v-model="variableSymbol" label="Variabilný symbol"></q-input>
            </div>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </q-card-section>
  </q-card>

  <q-card flat bordered class="invoice-items q-mb-md">
    <q-card-section>
      <q-table flat bordered :rows="tableRows" :columns="tableHeaders" row-key="name" binary-state-sort>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" title="Zadajte nazov položky" buttons v-slot="scope">
                <q-input type="text" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>
            <q-td key="quantity" :props="props">
              {{ props.row.quantity }}
              <q-popup-edit v-model="props.row.quantity" title="Zadajte množstvo" buttons v-slot="scope">
                <q-input
                  type="number"
                  v-model="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                  @update:model-value="index = props.rowIndex"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="unit" :props="props">
              <div class="text-pre-wrap">{{ props.row.unit }}</div>
              <q-popup-edit v-model="props.row.unit" title="Zadajte jednotku" buttons v-slot="scope">
                <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>
            <q-td key="price" :props="props">
              {{ props.row.price }}
              <q-popup-edit v-model="props.row.price" title="Zadajte cenu" buttons persistent v-slot="scope">
                <q-input
                  type="number"
                  v-model="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                  @update:model-value="index = props.rowIndex"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="vatRate" :props="props">
              {{ props.row.vatRate }}
              <q-popup-edit v-model="props.row.vatRate" title="DPH%" buttons persistent v-slot="scope">
                <q-input
                  type="number"
                  v-model="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                  @update:model-value="index = props.rowIndex"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="vatPrice" :props="props">
              {{ props.row.vatPrice }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <q-card flat bordered class="invioce-summary">
    <q-card-section>
      <div class="text-h6">Our Changing Planet</div>
    </q-card-section>
  </q-card>
</template>
