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

export { Company, SavedCompany, InvoiceItem }
