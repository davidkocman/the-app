// types
import type { InvoiceItem, Company } from '@/types/invoices'

const getInvoiceInputs = (
  variableSymbol: string,
  invoiceItems: InvoiceItem[],
  totalVatPrice: string,
  supplier: Company,
  consumer: Company
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
      supplierVat: `IČ DPH: ${consumer.vatId}`,
      separator1: ' ',
      issueDateTitle: 'Dátum vystavenia:',
      issueDateValue: '02.01.2024',
      deliveryDateTitle: 'Dátum dodania:',
      deliveryDateValue: '31.12.2023',
      dueDateTitle: 'Splatnosť:',
      dueDateValue: '16.01.2024',
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
      tableHeadLine: ' '
    }
  ]

  const getItemNumber = (inputs) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`itemNo${index + 1}`] = (index + 1).toString() + '.'
    })
  }
  const getItemName = (inputs) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Name`] = item.name
    })
  }
  const getItemQuantity = (inputs) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Quantity`] = item.quantity.toString()
    })
  }
  const getItemPrice = (inputs) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}Price`] = Number(item.price).toFixed(2).toString()
    })
  }
  const getItemVatRate = (inputs) => {
    invoiceItems.forEach((item, index) => {
      inputs[0][`item${index + 1}VatRate`] = Number(item.vatRate).toFixed(2).toString()
    })
  }
  const getItemVatPrice = (inputs) => {
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
