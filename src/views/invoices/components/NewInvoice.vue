<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import useInvoicesStore from '@/store/invoices'

// components
import InvoiceToPdf from '@/views/invoices/components/InvoiceToPdf.vue'

// types
import type { SavedCompany, InvoiceItem } from '@/types/invoices'

// utils
import { buttonLabel } from '@/utils/helpers'

const invoiceStore = useInvoicesStore()
const { companies } = storeToRefs(invoiceStore)

const TODAY = new Date()

const dialog = ref(false)
const selectedConsumer = ref<SavedCompany | null>(null)
const selectedSupplier = ref<SavedCompany | null>(null)
const vatRate = ref(23)
const issueDate = ref(`${TODAY.toISOString().split('T')[0]}`)
const dueDate = ref(`${TODAY.toISOString().split('T')[0]}`)
const deliveryDate = ref('')
const index = ref(0)

const getInitialVariableSymbol = () => {
  const YEAR = TODAY.getFullYear().toString().substr(-2)
  const MONTH = TODAY.getMonth()
  if (MONTH === 0) return `${YEAR}1201`
  return `${YEAR}${MONTH < 10 ? '0' + MONTH : MONTH}01`
}
const variableSymbol = ref(getInitialVariableSymbol())

const issueDateFormValue = computed(() => {
  return new Date(
    `${issueDate.value.split('/')[1]}/${issueDate.value.split('/')[2]}/${issueDate.value.split('/')[0]}`
  ).toLocaleDateString('sk')
})
const deliveryDateFormValue = computed(() => {
  return deliveryDate.value
    ? new Date(
        `${deliveryDate.value.split('-')[1]}/${deliveryDate.value.split('-')[2]}/${deliveryDate.value.split('-')[0]}`
      ).toLocaleDateString('sk')
    : ''
})
const dueDateFormValue = computed(() => {
  return dueDate.value
    ? new Date(
        `${dueDate.value.split('-')[1]}/${dueDate.value.split('-')[2]}/${dueDate.value.split('-')[0]}`
      ).toLocaleDateString('sk')
    : ''
})
const basePrice = computed(() => {
  const prices: number[] = []
  tableRows.value.forEach((item) => {
    prices.push(item.price * (item.quantity !== null ? item.quantity : 1))
  })
  return Number(prices.reduce((partialSum, a) => partialSum + a, 0)).toFixed(2)
})
const vat = computed(() => {
  return ((Number(basePrice.value) * tableRows.value[0].vatRate) / 100).toFixed(2)
})
const invoice = computed(() => {
  return {
    consumer: selectedConsumer.value as SavedCompany,
    supplier: selectedSupplier.value as SavedCompany,
    variableSymbol: variableSymbol.value,
    issueDate: issueDate.value,
    dueDate: dueDate.value,
    deliveryDate: deliveryDate.value,
    invoiceItems: tableRows.value
  }
})

type QuasarTableHeader = {
  name: string
  required?: boolean
  label: string
  align?: 'left' | 'center' | 'right'
  field: string
  sortable?: boolean
  style?: string
}

const tableHeaders = ref<QuasarTableHeader[]>([
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
  { name: 'vatRate', align: 'center', label: 'DPH %', field: 'vatRate' },
  { name: 'vatPrice', align: 'center', label: 'Spolu s DPH', field: 'vatPrice' },
  { name: 'actions', label: '', field: 'actions' }
])
const tableRows = ref<InvoiceItem[]>([
  {
    name: `Vývoj SPA aplikácií (${new Date().getMonth()}/${new Date().getFullYear()})`,
    quantity: 1,
    unit: '',
    price: 1,
    vatRate: vatRate.value,
    vatPrice: vatRate.value/100 * 1 + 1
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

const addInvoiceItem = () => {
  tableRows.value.push({
    name: '- Názov položky -',
    quantity: 1,
    unit: '',
    price: 0,
    vatRate: vatRate.value,
    vatPrice: 0
  })
}
const calculateVatPrice = () => { 
  tableRows.value[index.value].price = Number(tableRows.value[index.value].price)
  if (Number(tableRows.value[index.value].quantity)) {
    tableRows.value[index.value].vatPrice =
      tableRows.value[index.value].price +
      ((tableRows.value[index.value].vatRate * tableRows.value[index.value].price) / 100) *
        Number(tableRows.value[index.value].quantity)
    return
  }
  tableRows.value[index.value].vatPrice =
    tableRows.value[index.value].price +
    (tableRows.value[index.value].vatRate * tableRows.value[index.value].price) / 100
}
const removeRow = (i: number) => {
  index.value = 0
  tableRows.value.splice(i, 1)
}
const saveInvoice = () => {
  invoiceStore.saveInvoice(invoice.value)
  dialog.value = false
}
const setDefaultSupplier = () => {
  const defaultSupplier =
    companies.value.find(
      (company) => company.companyId === import.meta.env.VITE_APP_INVOICE_DEFAULT_SUPPLIER_COMPANY_ID
    ) || null
  if (defaultSupplier && !selectedSupplier.value) {
    selectedSupplier.value = defaultSupplier
  }
}
</script>

<template>
  <q-btn
    color="primary"
    icon="add"
    :label="buttonLabel('New invoice')"
    @click=";[(dialog = true), setDefaultSupplier()]"
    data-cy="new-note-add-button"
  />

  <q-dialog
    v-model="dialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="new-invoice-dialog"
  >
    <q-card flat class="invoice-heading">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="index = 0">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div class="section-wrapper shadow-2 q-pa-sm rounded-borders">
          <div class="row q-mb-sm q-gutter-md">
            <div class="col">
              <q-select
                outlined
                v-model="selectedConsumer"
                :options="companies"
                option-label="name"
                option-value="id"
                label="Odberateľ"
              />
            </div>
            <div class="col">
              <q-select
                outlined
                v-model="selectedSupplier"
                :options="companies"
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
            <div class="col">
              <div v-if="selectedSupplier" class="consumer-details q-pl-sm">
                <h4 class="text-caption">
                  {{ selectedSupplier.street }}
                </h4>
                <h4 class="text-caption">{{ selectedSupplier.zip }}, {{ selectedSupplier.city }}</h4>
                <h4 class="text-caption">
                  {{ selectedSupplier.country }}
                </h4>
                <q-separator class="q-my-sm" />
                <h4 class="text-caption">
                  IČO: <span class="text-subtitle2">{{ selectedSupplier.companyId }}</span>
                </h4>
                <h4 class="text-caption">
                  DIČ: <span class="text-subtitle2">{{ selectedSupplier.taxId }}</span>
                </h4>
                <h4 v-if="selectedSupplier.vatId" class="text-caption">
                  IČ DPH: <span class="text-subtitle2">{{ selectedSupplier.vatId }}</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="section-wrapper shadow-2 q-pa-sm rounded-borders">
          <div class="row q-gutter-md">
            <div class="col-10 col-md-6">
              <div class="row q-gutter-md q-mb-md">
                <div class="col">
                  <q-input outlined v-model="issueDateFormValue" label="Dátum vystavenia">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="issueDate" mask="YYYY-MM-DD">
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
                          <q-date v-model="deliveryDate" mask="YYYY-MM-DD">
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
                          <q-date v-model="dueDate" mask="YYYY-MM-DD">
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
            <div class="col-2 col-md-5"></div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="section-wrapper shadow-2 q-pa-sm rounded-borders">
          <q-table flat :rows="tableRows" :columns="tableHeaders" row-key="name" binary-state-sort>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                  <q-popup-edit v-model="props.row.name" title="Zadajte nazov položky" buttons v-slot="scope">
                    <q-input type="text" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                  </q-popup-edit>
                </q-td>
                <q-td key="quantity" :props="props">
                  {{ props.row.quantity > 1 ? props.row.quantity : '' }}
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
                  {{ Number(props.row.price).toFixed(2) }}
                  <q-popup-edit v-model="props.row.price" title="Zadajte cenu" buttons v-slot="scope">
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
                  <q-popup-edit v-model="props.row.vatRate" title="DPH%" buttons v-slot="scope">
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
                  {{ props.row.vatPrice.toFixed(2) }}
                </q-td>
                <q-td v-if="tableRows.length > 1" :props="props" key="actions">
                  <q-btn
                    color="negative"
                    icon="delete"
                    no-caps
                    flat
                    dense
                    @click="removeRow(tableRows.indexOf(props.row))"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-btn
            label="New invoice item"
            icon="add"
            color="primary"
            class="q-my-sm"
            @click="addInvoiceItem"
            :disable="tableRows.length === 5"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-4 col-md-8"></div>
          <div class="col-8 col-md-4">
            <q-separator class="q-my-sm" />
            <div class="row">
              <div class="col-8">Základ DPH</div>
              <div class="col-4 text-right">{{ basePrice }} EUR</div>
            </div>
            <div class="row">
              <div class="col-8">DPH</div>
              <div class="col-4 text-right">{{ vat }} EUR</div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row">
              <div class="col-8 text-weight-bold">Celkom</div>
              <div class="col-4 text-right text-weight-bold">
                {{ (parseFloat(basePrice) + parseFloat(vat)).toFixed(2) }} EUR
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="selectedSupplier && selectedConsumer && deliveryDate">
        <div class="row q-gutter-sm">
          <InvoiceToPdf
            :variableSymbol="variableSymbol"
            :invoiceItems="tableRows"
            :totalVatPrice="(parseFloat(basePrice) + parseFloat(vat)).toFixed(2)"
            :supplier="selectedSupplier"
            :consumer="selectedConsumer"
            :issueDate="issueDate"
            :deliveryDate="deliveryDate"
            :dueDate="dueDate"
            :basePrice="basePrice"
            :vat="vat"
          />
          <q-btn label="Save" icon="save" @click="saveInvoice" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
