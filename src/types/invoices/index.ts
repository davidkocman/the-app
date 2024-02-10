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

interface SavedCompany extends Company {
  id: string
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
  consumerId: string | null
  supplierId: string | null
  variableSymbol: string
  issueDate: string
  dueDate: string
  deliveryDate: string
  invoiceItems: InvoiceItem[]
  user?: string
}

interface SavedInvoice extends Invoice {
  id: string
}

export { Company, Invoice, InvoiceItem, SavedCompany, SavedInvoice }
