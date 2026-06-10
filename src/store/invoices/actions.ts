import { supabase } from '@/supabaseConfig'
import getUserId from '@/utils/getUserId'
import useAppStore from '@/store/app'
import getErrorMessage from '@/utils/handleCatchErrors'

import type { PiniaActionAdaptor } from '@/types/store'
import type { Actions, InvoicesStore } from './types'
import type {
  Company,
  CompanyRow,
  Invoice,
  InvoiceRow,
  SavedCompany,
  SavedInvoice
} from '@/types/invoices'

// --- Mappers ---------------------------------------------------------------

const toSavedCompany = (r: CompanyRow): SavedCompany => ({
  id: r.id,
  name: r.name,
  street: r.street,
  zip: r.zip,
  city: r.city,
  country: r.country,
  companyId: r.company_id,
  taxId: r.tax_id,
  vatId: r.vat_id ?? undefined,
  iban: r.iban,
  swift: r.swift,
  registration: r.registration,
  businessReg: r.business_reg
})

const companyToRow = (c: Company) => ({
  name: c.name,
  street: c.street,
  zip: c.zip,
  city: c.city,
  country: c.country,
  company_id: c.companyId,
  tax_id: c.taxId,
  vat_id: c.vatId ?? null,
  iban: c.iban,
  swift: c.swift,
  registration: c.registration,
  business_reg: c.businessReg
})

const toSavedInvoice = (r: InvoiceRow): SavedInvoice => ({
  id: r.id,
  consumer: r.consumer,
  supplier: r.supplier,
  variableSymbol: r.variable_symbol,
  issueDate: r.issue_date,
  dueDate: r.due_date,
  deliveryDate: r.delivery_date,
  invoiceItems: r.invoice_items,
  zeroVatRateValue: r.zero_vat_rate_value,
  isPayed: r.is_payed
})

// invoice scalar/jsonb fields (excludes is_payed, which is managed separately)
const invoiceToRow = (i: Invoice) => ({
  variable_symbol: i.variableSymbol,
  issue_date: i.issueDate,
  due_date: i.dueDate,
  delivery_date: i.deliveryDate,
  zero_vat_rate_value: i.zeroVatRateValue,
  consumer: i.consumer,
  supplier: i.supplier,
  invoice_items: i.invoiceItems
})

export const actions: PiniaActionAdaptor<Actions, InvoicesStore> = {
  async saveCompany(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase
        .from('companies')
        .insert({ user_id: uid, ...companyToRow(payload) })
        .select('*')
        .single()
      if (error) throw error
      this.companies.push(toSavedCompany(data as CompanyRow))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async saveInvoice(payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase
        .from('invoices')
        .insert({ user_id: uid, ...invoiceToRow(payload) })
        .select('*')
        .single()
      if (error) throw error
      this.invoices.push(toSavedInvoice(data as InvoiceRow))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async editCompany(company) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      // Ownership enforced by RLS.
      const { error } = await supabase.from('companies').update(companyToRow(company)).eq('id', company.id)
      if (error) throw error
      this.companies = this.companies.map((item: SavedCompany) =>
        item.id === company.id ? { ...item, ...company } : item
      )
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async removeCompany(id) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id)
      if (error) throw error
      this.companies = this.companies.filter((item: SavedCompany) => item.id !== id)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async editInvoice(id, payload) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const { error } = await supabase.from('invoices').update(invoiceToRow(payload)).eq('id', id)
      if (error) throw error
      this.invoices = this.invoices.map((item: SavedInvoice) => (item.id === id ? { ...item, ...payload } : item))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async removeInvoice(id) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id)
      if (error) throw error
      this.invoices = this.invoices.filter((item: SavedInvoice) => item.id !== id)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async updateIsPayedStatus(id, invoice) {
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const { error } = await supabase.from('invoices').update({ is_payed: invoice.isPayed }).eq('id', id)
      if (error) throw error
      this.invoices = this.invoices.map((item: SavedInvoice) => (item.id === id ? { ...item, ...invoice } : item))
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getCompanies() {
    if (this.companies.length !== 0) {
      return
    }
    const appStore = useAppStore()
    appStore.loading = true
    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase.from('companies').select('*').eq('user_id', uid)
      if (error) throw error
      this.companies = (data as CompanyRow[]).map(toSavedCompany)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  async getInvoices() {
    if (this.invoices.length !== 0) {
      return
    }
    const appStore = useAppStore()
    appStore.loading = true

    // Current year date range (previous Jan 1 .. next Jan 1)
    const startOfYear = new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0]
    const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0]

    try {
      const uid = await getUserId()
      if (!uid) return
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', uid)
        .gte('delivery_date', startOfYear)
        .lt('delivery_date', endOfYear)
        .order('delivery_date', { ascending: true })
        .order('variable_symbol', { ascending: false })
      if (error) throw error
      this.invoices = (data as InvoiceRow[]).map(toSavedInvoice)
    } catch (e) {
      appStore.reportError({ message: getErrorMessage(e) })
    } finally {
      appStore.loading = false
    }
  },
  unlockInvoices(val) {
    if (val === import.meta.env.VITE_APP_INVOICE_PASSWORD) this.pageLocked = false
  }
}
