
export const getSupplierTransactions = (supplierId, transactions) =>
  transactions
    .filter(t => t.supplierId === supplierId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))

export const getSupplierTotals = (supplier, transactions) => {
  const rows = getSupplierTransactions(supplier.id, transactions)
  const purchased = rows.reduce((sum, row) => sum + Number(row.purchase || 0), 0)
  const paid = rows.reduce((sum, row) => sum + Number(row.payment || 0), 0)
  return {
    opening: Number(supplier.openingBalance || 0),
    purchased,
    paid,
    outstanding: Number(supplier.openingBalance || 0) + purchased - paid,
  }
}

export const getRunningBalance = (
  supplier,
  rows,
) => {
  let balance = Number(supplier.openingBalance || 0)
  return rows.map(row => {
    balance += Number(row.purchase || 0) - Number(row.payment || 0)
    return { ...row, balance }
  })
}

export const getOverallTotals = (suppliers, transactions) => {
  let purchased = 0
  let paid = 0
  for (const t of transactions) {
    purchased += Number(t.purchase || 0)
    paid += Number(t.payment || 0)
  }
  const opening = suppliers.reduce((sum, s) => sum + Number(s.openingBalance || 0), 0)
  return {
    opening,
    purchased,
    paid,
    outstanding: opening + purchased - paid,
    dueSuppliers: suppliers.filter(s => getSupplierTotals(s, transactions).outstanding > 0).length,
  }
}

export const getStatus = (outstanding) => {
  if (outstanding <= 0) return 'Paid'
  if (outstanding >= 50000) return 'High Due'
  return 'Pending'
}
