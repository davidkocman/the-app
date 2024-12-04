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
}

interface SavedCompany extends Company {
  id: string
}

interface SavedInvoice extends Invoice {
  id: string
  isPayed?: boolean
}

export type { Company, Invoice, InvoiceItem, SavedCompany, SavedInvoice }
