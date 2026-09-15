
import * as XLSX from 'xlsx'

import { getOverallTotals, getSupplierTotals } from './calculations'

const clean = (v) =>
  v === undefined || v === null ? '' : String(v).trim()

const toNumber = (v) => {
  const n = Number(String(v ?? '').replace(/[₹,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const excelDate = (v) => {
  if (v instanceof Date) {
    return v.toISOString().slice(0, 10)
  }

  if (typeof v === 'number') {
    const date = XLSX.SSF.parse_date_code(v)

    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(
        date.d
      ).padStart(2, '0')}`
    }
  }

  const raw = clean(v)

  if (!raw) {
    return new Date().toISOString().slice(0, 10)
  }

  const d = new Date(raw)

  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10)
  }

  const parts = raw.split(/[\/-]/)

  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number)

    if (a > 1900) {
      return `${a}-${String(b).padStart(2, '0')}-${String(c).padStart(
        2,
        '0'
      )}`
    }

    return `${c}-${String(b).padStart(2, '0')}-${String(a).padStart(
      2,
      '0'
    )}`
  }

  return new Date().toISOString().slice(0, 10)
}

export const exportAllData = (data) => {
  const wb = XLSX.utils.book_new()

  const suppliers = data.suppliers.map((s) => {
    const totals = getSupplierTotals(s, data.transactions)

    return {
      'Supplier ID': s.id,
      'Supplier Name': s.name,
      'Contact Person': s.contactPerson,
      'Phone Number': s.phone,
      'Opening Balance': totals.opening,
      'Total Purchased': totals.purchased,
      'Total Paid': totals.paid,
      Outstanding: totals.outstanding,
    }
  })

  const transactions = data.transactions.map((t) => ({
    Date: t.date,
    Supplier:
      data.suppliers.find((s) => s.id === t.supplierId)?.name ?? '',
    'Supplier ID': t.supplierId,
    'Bill / Ref No.': t.billRef,
    Description: t.description,
    'Purchase / Due': t.purchase,
    Payment: t.payment,
    'Payment Mode': t.paymentMode,
    Remarks: t.remarks,
  }))

  const totals = getOverallTotals(
    data.suppliers,
    data.transactions
  )

  const dashboard = [
    ['Metric', 'Value'],
    ['Total Outstanding', totals.outstanding],
    ['Total Purchased', totals.purchased],
    ['Total Paid', totals.paid],
    ['Suppliers With Due', totals.dueSuppliers],
  ]

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(suppliers),
    'Suppliers'
  )

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(transactions),
    'Transactions'
  )

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(dashboard),
    'Dashboard'
  )

  XLSX.writeFile(wb, 'Shri_Ram_Vastralay_Khata.xlsx')
}

export const exportSupplierStatement = (
  supplier,
  transactions
) => {
  const rows = transactions
    .filter((t) => t.supplierId === supplier.id)
    .sort((a, b) => a.date.localeCompare(b.date))

  let balance = supplier.openingBalance

  const output = rows.map((t) => {
    balance += t.purchase - t.payment

    return {
      Date: t.date,
      'Bill / Ref No.': t.billRef,
      Description: t.description,
      Type: t.purchase > 0 ? 'Purchase' : 'Payment',
      'Purchase / Due': t.purchase,
      Payment: t.payment,
      Mode: t.paymentMode,
      Balance: balance,
    }
  })

  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(output),
    'Supplier Statement'
  )

  const fileName = `${supplier.name.replace(
    /[^\w]+/g,
    '_'
  )}_Statement.xlsx`

  XLSX.writeFile(wb, fileName)
}

export const importExcel = async (file) => {
  const buffer = await file.arrayBuffer()

  const wb = XLSX.read(buffer, {
    type: 'array',
    cellDates: true,
  })

  const supplierSheet =
    wb.Sheets['Suppliers'] ?? wb.Sheets[wb.SheetNames[0]]

  const transactionSheet =
    wb.Sheets['Transactions'] ?? wb.Sheets[wb.SheetNames[1]]

  const supplierRows = supplierSheet
    ? XLSX.utils.sheet_to_json(supplierSheet, {
        defval: '',
      })
    : []

  const transactionRows = transactionSheet
    ? XLSX.utils.sheet_to_json(transactionSheet, {
        defval: '',
      })
    : []

  const errors = []
  const suppliers = []

  const idMap = new Map()
  const nameMap = new Map()

  supplierRows.forEach((row, index) => {
    const id =
      clean(row['Supplier ID']) ||
      `SUP${String(index + 1).padStart(3, '0')}`

    const name = clean(row['Supplier Name'])

    if (!name) return

    const supplier = {
      id,
      name,
      contactPerson: clean(row['Contact Person']),
      phone: clean(row['Phone Number']),
      openingBalance: toNumber(row['Opening Balance']),
      createdAt: new Date().toISOString(),
    }

    suppliers.push(supplier)

    idMap.set(id.toLowerCase(), id)
    nameMap.set(name.toLowerCase(), id)
  })

  const transactions = []

  transactionRows.forEach((row, index) => {
    const rawId = clean(row['Supplier ID'])
    const rawName = clean(row['Supplier'])

    const supplierId =
      idMap.get(rawId.toLowerCase()) ??
      nameMap.get(rawName.toLowerCase())

    if (!supplierId) {
      if (rawName || rawId) {
        errors.push(
          `Transaction row ${index + 2}: supplier not found (${
            rawName || rawId
          })`
        )
      }

      return
    }

    const mode = clean(row['Payment Mode'])

    transactions.push({
      id: `TXN-${Date.now()}-${index}`,
      date: excelDate(row['Date']),
      supplierId,
      billRef: clean(row['Bill / Ref No.']),
      description: clean(row['Description']),
      purchase: toNumber(row['Purchase / Due']),
      payment: toNumber(row['Payment']),
      paymentMode: [
        'Cash',
        'UPI',
        'Bank Transfer',
        'Cheque',
        'Other',
      ].includes(mode)
        ? mode
        : 'Other',
      remarks: clean(row['Remarks']),
      createdAt: new Date().toISOString(),
    })
  })

  return {
    data: {
      suppliers,
      transactions,
    },
    errors,
  }
}
