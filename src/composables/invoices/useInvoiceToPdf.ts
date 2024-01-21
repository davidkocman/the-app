import { Ref } from 'vue'
import { getInvoiceTemplate } from '@/utils/getInvoiceTemplate'
import { getInvoiceInputs } from '@/utils/getInvoiceInputs'
import { generate } from '@pdfme/generator'

// types
import type { InvoiceItem } from '@/types/invoices'

export default function useInvoiceToPdf(
  variableSymbol: Ref<string>,
  tableRows: Ref<InvoiceItem[]>,
  totalVatPrice: Ref<string>,
  iban: Ref<string>,
  swift: Ref<string>
) {
  const generateInvoice = () => {
    const template = getInvoiceTemplate(tableRows.value)
    const inputs = getInvoiceInputs(variableSymbol.value, tableRows.value, totalVatPrice.value, iban.value, swift.value)
    generate({ template, inputs }).then((pdf) => {
      // Browser
      const blob = new Blob([pdf.buffer], { type: 'application/pdf' })
      window.open(URL.createObjectURL(blob))

      // Node.js
      // fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
    })
  }

  return {
    generateInvoice
  }
}
