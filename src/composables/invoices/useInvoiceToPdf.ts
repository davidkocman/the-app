import { Ref } from 'vue'
import { getInvoiceTemplate } from '@/utils/getInvoiceTemplate'
import { getInvoiceInputs } from '@/utils/getInvoiceInputs'
import { generate } from '@pdfme/generator'

// types
import type { InvoiceItem, Company } from '@/types/invoices'

export default function useInvoiceToPdf(
  variableSymbol: Ref<string>,
  tableRows: Ref<InvoiceItem[]>,
  totalVatPrice: Ref<string>,
  supplier: Ref<Company>,
  consumer: Ref<Company>,
  issueDate: Ref<string>,
  deliveryDate: Ref<string>,
  dueDate: Ref<string>,
  basePrice: Ref<string>,
  vat: Ref<string>,
  zeroVatRateValue: Ref<string | null>
) {
  const generateInvoice = () => {
    const template = getInvoiceTemplate(tableRows.value)
    const inputs = getInvoiceInputs(
      variableSymbol.value,
      tableRows.value,
      totalVatPrice.value,
      supplier.value,
      consumer.value,
      issueDate.value,
      deliveryDate.value,
      dueDate.value,
      basePrice.value,
      vat.value,
      zeroVatRateValue.value
    )
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
