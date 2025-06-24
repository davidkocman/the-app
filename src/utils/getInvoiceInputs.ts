// types
import type { InvoiceItem, Company } from '@/types/invoices'

const getInvoiceInputs = (
  variableSymbol: string,
  invoiceItems: InvoiceItem[],
  totalVatPrice: string,
  supplier: Company,
  consumer: Company,
  issueDate: string,
  deliveryDate: string,
  dueDate: string,
  basePrice: string,
  vat: string,
  zeroVatRateValue: string | null
) => {
  const inputs = [
    {
      invoiceTitle: `FAKTÚRA ${variableSymbol}`,
      consumerTitle: 'DODÁVATEĽ',
      consumerName: supplier.name,
      consumerAddress: `${supplier.street}, ${supplier.zip} ${supplier.city}, ${supplier.country}`,
      consumerId: `IČO: ${supplier.companyId}`,
      consumerTax: `DIČ: ${supplier.taxId}`,
      consumerVat: `IČ DPH: ${supplier.vatId}`,
      consumerContact: 'KONTAKTNÉ ÚDAJE',
      supplierTitle: 'ODBERATEĽ',
      supplierName: consumer.name,
      supplierAddress: `${consumer.street}, ${consumer.zip} ${consumer.city}, ${consumer.country}`,
      supplierId: `IČO: ${consumer.companyId}`,
      supplierTax: `DIČ: ${consumer.taxId}`,
      supplierVat: consumer.country === 'Slovenská republika' ? `IČ DPH: ${consumer.vatId}` : '',
      separator1: ' ',
      issueDateTitle: 'Dátum vystavenia:',
      issueDateValue: `${new Date(issueDate).toLocaleDateString('sk')}`,
      deliveryDateTitle: 'Dátum dodania:',
      deliveryDateValue: `${new Date(deliveryDate).toLocaleDateString('sk')}`,
      dueDateTitle: 'Splatnosť:',
      dueDateValue: `${new Date(dueDate).toLocaleDateString('sk')}`,
      paymentMethod: 'Spôsob úhrady: Bankový prevod',
      sum: `Suma: ${totalVatPrice} EUR`,
      variableSymbol: `Variabilný symbol: ${variableSymbol}`,
      iban: `IBAN: ${supplier.iban
        .replace(/[^\dA-Z]/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()}`,
      swift: `SWIFT: ${supplier.swift}`,
      itemNoTitle: 'Č.',
      itemNameTitle: 'NÁZOV',
      quantityTitle: 'MNOŽSTVO',
      priceTitle: 'CENA BEZ DPH',
      vatRateTitle: 'DPH %',
      vatPriceTitle: 'SPOLU S DPH',
      tableHeadLine: ' ',
      tableHeadLineEnd: ' ',
      basePriceTitle: 'ZÁKLAD',
      basePrice: `${basePrice} EUR`,
      vatTitle: zeroVatRateValue ?? 'DPH',
      vat: `${vat} EUR`,
      totalToPayTitle: 'Celkom k úhrade',
      totalToPay: `${totalVatPrice} EUR`,
      registration: `Registrácia: ${supplier.registration}`,
      businessReg: `Obch. register vl. č.: ${supplier.businessReg}`
    }
  ]

  const getItemNumber = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((_item, index) => {
      inputs[0][`itemNo${index + 1}`] = (index + 1).toString() + '.'
    })
  }
  const getItemName = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Name`] = item.name
    })
  }
  const getItemQuantity = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Quantity`] = item.quantity.toString()
    })
  }
  const getItemPrice = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Price`] = Number(item.price).toFixed(2).toString()
    })
  }
  const getItemVatRate = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}VatRate`] = Number(item.vatRate).toString()
    })
  }
  const getItemVatPrice = (inputs: { [key: string]: string }[]) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}VatPrice`] = Number(item.vatPrice).toFixed(2).toString()
    })
  }

  getItemNumber(inputs)
  getItemName(inputs)
  getItemQuantity(inputs)
  getItemPrice(inputs)
  getItemVatRate(inputs)
  getItemVatPrice(inputs)

  return inputs
}

export { getInvoiceInputs }
