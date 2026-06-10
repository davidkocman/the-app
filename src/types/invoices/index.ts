interface Company {
  name: string
  street: string
  zip: string
  city: string
  country: string
  companyId: string
  taxId: string
  vatId?: string
  iban: string
  swift: string
  registration: string
  businessReg: string
  user?: string
}

type InvoiceItem = {
  name: string
  quantity: number
  unit: string
  price: number
  vatRate: number
  vatPrice: number
}

type Invoice = {
  consumer: SavedCompany
  supplier: SavedCompany
  variableSymbol: string
  issueDate: string
  dueDate: string
  deliveryDate: string
  invoiceItems: InvoiceItem[]
  user?: string
  zeroVatRateValue: string | null
}

interface SavedCompany extends Company {
  id: string
}

interface SavedInvoice extends Invoice {
  id: string
  isPayed?: boolean
}

// Row shapes as stored in Supabase (snake_case)
type CompanyRow = {
  id: string
  name: string
  street: string
  zip: string
  city: string
  country: string
  company_id: string
  tax_id: string
  vat_id: string | null
  iban: string
  swift: string
  registration: string
  business_reg: string
}

type InvoiceRow = {
  id: string
  variable_symbol: string
  issue_date: string
  due_date: string
  delivery_date: string
  zero_vat_rate_value: string | null
  is_payed: boolean
  consumer: SavedCompany
  supplier: SavedCompany
  invoice_items: InvoiceItem[]
}

export type { Company, Invoice, InvoiceItem, SavedCompany, SavedInvoice, CompanyRow, InvoiceRow }
