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
            x: 165,
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
          opacity: 0.5,
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
          opacity: 0.5,
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
          opacity: 0.5,
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
          opacity: 0.5,
          fontName: 'Roboto'
        },
        vatRateTitle: {
          type: 'text',
          position: {
            x: 150,
            y: 115
          },
          width: 20,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 0.5,
          fontName: 'Roboto'
        },
        vatPriceTitle: {
          type: 'text',
          position: {
            x: 175,
            y: 115
          },
          width: 25,
          height: 5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 10,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#000000',
          opacity: 0.5,
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
        },
        registration: {
          type: 'text',
          position: {
            x: 85,
            y: 285
          },
          width: 60,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#838383',
          opacity: 1,
          fontName: 'Roboto'
        },
        businessReg: {
          type: 'text',
          position: {
            x: 85,
            y: 290
          },
          width: 60,
          height: 0.5,
          rotate: 0,
          alignment: 'left',
          verticalAlignment: 'top',
          fontSize: 8,
          lineHeight: 1,
          characterSpacing: 0,
          fontColor: '#838383',
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
        height: 5,
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
        height: 5,
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
        height: 5,
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
        height: 5,
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
    invoiceItems.forEach((_item, index) => {
      template.schemas[0][`item${index + 1}VatRate`] = {
        type: 'text',
        position: {
          x: 150,
          y: y + index * 5
        },
        width: 20,
        height: 5,
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
        height: 5,
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

  const tableHeadLineEnd = () => {
    template.schemas[0]['tableHeadLineEnd'] = {
      type: 'text',
      position: {
        x: 10,
        y: 123 + invoiceItems.length * 5
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

  const basePriceTitlePosition = () => {
    template.schemas[0]['basePriceTitle'] = {
      type: 'text',
      position: {
        x: 110,
        y: 130 + invoiceItems.length * 5
      },
      width: 40,
      height: 5,
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
  }

  const basePricePosition = () => {
    template.schemas[0]['basePrice'] = {
      type: 'text',
      position: {
        x: 170,
        y: 130 + invoiceItems.length * 5
      },
      width: 40,
      height: 5,
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
  }

  const vatTitlePosition = () => {
    template.schemas[0]['vatTitle'] = {
      type: 'text',
      position: {
        x: 110,
        y: 135 + invoiceItems.length * 5
      },
      width: 190,
      height: 5,
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
  }

  const vatPosition = () => {
    template.schemas[0]['vat'] = {
      type: 'text',
      position: {
        x: 170,
        y: 135 + invoiceItems.length * 5
      },
      width: 40,
      height: 5,
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
  }

  const totalToPayTitlePosition = () => {
    template.schemas[0]['totalToPayTitle'] = {
      type: 'text',
      position: {
        x: 110,
        y: 140 + invoiceItems.length * 5
      },
      width: 60,
      height: 6,
      rotate: 0,
      alignment: 'left',
      verticalAlignment: 'top',
      fontSize: 12,
      lineHeight: 1.3,
      characterSpacing: 0,
      fontColor: '#000000',
      backgroundColor: '#e1e1e1',
      opacity: 1,
      fontName: 'Roboto'
    }
  }

  const totalToPayPosition = () => {
    template.schemas[0]['totalToPay'] = {
      type: 'text',
      position: {
        x: 170,
        y: 140 + invoiceItems.length * 5
      },
      width: 30,
      height: 6,
      rotate: 0,
      alignment: 'left',
      verticalAlignment: 'top',
      fontSize: 12,
      lineHeight: 1.3,
      characterSpacing: 0,
      fontColor: '#000000',
      backgroundColor: '#e1e1e1',
      opacity: 1,
      fontName: 'Roboto'
    }
  }

  getItemNumbers()
  getItemNames()
  getItemQuantity()
  getItemPrice()
  getItemVatRate()
  getItemVatPrice()
  tableHeadLineEnd()
  basePriceTitlePosition()
  basePricePosition()
  vatTitlePosition()
  vatPosition()
  totalToPayTitlePosition()
  totalToPayPosition()

  return template
}

export { getInvoiceTemplate }
