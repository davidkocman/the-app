import { Template, BLANK_PDF } from '@pdfme/common'

// types
import type { InvoiceItem } from '@/types/invoices'

const getInvoiceTemplate = (invoiceItems: InvoiceItem[]) => {
  const template: Template = {
    basePdf: BLANK_PDF,
    schemas: [
      {
        invoiceTitle: {
          type: 'text',
          position: {
            x: 161.05,
            y: 10.11
          },
          width: 40,
          height: 5,
          fontSize: 12,
          fontColor: '#000000',
          fontName: 'Roboto'
        },
        consumerTitle: {
          type: 'text',
          position: {
            x: 10,
            y: 30
          },
          width: 30,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 12,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#555555',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        consumerName: {
          type: 'text',
          position: {
            x: 10,
            y: 38
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        consumerAddress: {
          type: 'text',
          position: {
            x: 10,
            y: 43
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        consumerId: {
          type: 'text',
          position: {
            x: 10,
            y: 53
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        consumerTax: {
          type: 'text',
          position: {
            x: 10,
            y: 58
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        consumerVat: {
          type: 'text',
          position: {
            x: 10,
            y: 63
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierTitle: {
          type: 'text',
          position: {
            x: 110,
            y: 30
          },
          width: 30,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 12,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#555555',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierName: {
          type: 'text',
          position: {
            x: 110,
            y: 38
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierAddress: {
          type: 'text',
          position: {
            x: 110,
            y: 43
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierId: {
          type: 'text',
          position: {
            x: 110,
            y: 53
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierTax: {
          type: 'text',
          position: {
            x: 110,
            y: 58
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        supplierVat: {
          type: 'text',
          position: {
            x: 110,
            y: 63
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        separator1: {
          type: 'text',
          position: {
            x: 10,
            y: 75
          },
          width: 190,
          height: 1,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 0,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#ffffff',
          backgroundColor: '#cacaca',
          opacity: 1,
          fontName: 'Roboto'
        },
        issueDateTitle: {
          type: 'text',
          position: {
            x: 10,
            y: 80
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        issueDateValue: {
          type: 'text',
          position: {
            x: 50,
            y: 80
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        deliveryDateTitle: {
          type: 'text',
          position: {
            x: 10,
            y: 85
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        deliveryDateValue: {
          type: 'text',
          position: {
            x: 50,
            y: 85
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        dueDateTitle: {
          type: 'text',
          position: {
            x: 10,
            y: 90
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        dueDateValue: {
          type: 'text',
          position: {
            x: 50,
            y: 90
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        paymentMethod: {
          type: 'text',
          position: {
            x: 110,
            y: 80
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        sum: {
          type: 'text',
          position: {
            x: 110,
            y: 85
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        variableSymbol: {
          type: 'text',
          position: {
            x: 110,
            y: 90
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        iban: {
          type: 'text',
          position: {
            x: 110,
            y: 95
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        swift: {
          type: 'text',
          position: {
            x: 110,
            y: 100
          },
          width: 100,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          backgroundColor: '',
          opacity: 1,
          fontName: 'Roboto'
        },
        itemNoTitle: {
          type: 'text',
          position: {
            x: 10,
            y: 115
          },
          width: 5,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        itemNameTitle: {
          type: 'text',
          position: {
            x: 20,
            y: 115
          },
          width: 65,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        quantityTitle: {
          type: 'text',
          position: {
            x: 90,
            y: 115
          },
          width: 20,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        priceTitle: {
          type: 'text',
          position: {
            x: 115,
            y: 115
          },
          width: 30,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        vatRateTitle: {
          type: 'text',
          position: {
            x: 150,
            y: 115
          },
          width: 20,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        vatPriceTitle: {
          type: 'text',
          position: {
            x: 175,
            y: 115
          },
          width: 25,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        },
        tableHeadLine: {
          type: 'text',
          position: {
            x: 10,
            y: 120
          },
          width: 190,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 0,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#ffffff',
          backgroundColor: '#000000',
          opacity: 1,
          fontName: 'Roboto'
        }
      }
    ]
  }

  const getItemNumbers = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`itemNo${index + 1}`] = {
        type: 'text',
        position: {
          x: 10,
          y: y + index * 5
        },
        width: 5,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 0.5,
        fontName: 'Roboto'
      }
    })
  }

  const getItemNames = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`item${index + 1}Name`] = {
        type: 'text',
        position: {
          x: 20,
          y: y + index * 5
        },
        width: 65,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 1,
        fontName: 'Roboto'
      }
    })
  }

  const getItemQuantity = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`item${index + 1}Quantity`] = {
        type: 'text',
        position: {
          x: 90,
          y: y + index * 5
        },
        width: 20,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 1,
        fontName: 'Roboto'
      }
    })
  }

  const getItemPrice = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`item${index + 1}Price`] = {
        type: 'text',
        position: {
          x: 115,
          y: y + index * 5
        },
        width: 30,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 1,
        fontName: 'Roboto'
      }
    })
  }

  const getItemVatRate = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`item${index + 1}VatRate`] = {
        type: 'text',
        position: {
          x: 150,
          y: y + index * 5
        },
        width: 20,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 1,
        fontName: 'Roboto'
      }
    })
  }

  const getItemVatPrice = () => {
    const y = 122
    invoiceItems.forEach((item, index) => {
      template.schemas[0][`item${index + 1}VatPrice`] = {
        type: 'text',
        position: {
          x: 175,
          y: y + index * 5
        },
        width: 25,
        height: 0.5,
        rotate: 0,
        alignment: 'left',
        verticalAlignment: 'top',
        fontSize: 10,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: '#000000',
        opacity: 1,
        fontName: 'Roboto'
      }
    })
  }

  getItemNumbers()
  getItemNames()
  getItemQuantity()
  getItemPrice()
  getItemVatRate()
  getItemVatPrice()

  return template
}

export { getInvoiceTemplate }
