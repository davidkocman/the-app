interface Consumer {
  name: string
  street: string
  zip: string
  city: string
  country: string
  companyId: string
  taxId: string
  vatId?: string
}

interface SavedConsumer extends Consumer {
  id: string
}

type InvoiceItem = {
  name: string
  quantity: number | null
  unit: string | null
  price: number
  vatRate: number
  vatPrice: number
}

export { Consumer, SavedConsumer, InvoiceItem }
