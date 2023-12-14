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

export { Consumer, SavedConsumer }
