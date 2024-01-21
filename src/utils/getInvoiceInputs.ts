// types
import type { InvoiceItem } from '@/types/invoices'

const getInvoiceInputs = (
  variableSymbol: string,
  invoiceItems: InvoiceItem[],
  totalVatPrice: string,
  iban: string,
  swift: string
) => {
  const inputs = [
    {
      invoiceTitle: `FAKTÚRA ${variableSymbol}`,
      consumerTitle: 'DODÁVATEĽ',
      consumerName: 'GI-NA, s.r.o.',
      consumerAddress: 'Svätoondrejská 6, 945 01 Komárno, Slovensko',
      consumerId: 'IČO: 47858486',
      consumerTax: 'DIČ: 2024122958',
      consumerVat: 'IČ DPH: SK2024122958',
      consumerContact: 'KONTAKTNÉ ÚDAJE',
      supplierTitle: 'ODBERATEĽ',
      supplierName: 'GreenWay Infrastructure s.r.o.',
      supplierAddress: 'Einsteinova 24, 851 01 Bratislava, Slovensko',
      supplierId: 'IČO: 47858486',
      supplierTax: 'DIČ: 2024122958',
      supplierVat: 'IČ DPH: SK2024122958',
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
      iban: `IBAN: ${iban
        .replace(/[^\dA-Z]/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()}`,
      swift: `SWIFT: ${swift}`,
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
