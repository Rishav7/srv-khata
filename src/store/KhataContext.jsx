import { createContext, useContext, useEffect, useMemo, useState } from 'react'



const Context = createContext(null)
const STORAGE = 'shri-ram-vastalay-khata-v2'

const seed = {
  suppliers: [
    { id: 'SUP001', name: 'ABC Textiles', contactPerson: 'Ramesh', phone: '9876543210', openingBalance: 0, createdAt: new Date().toISOString() },
    { id: 'SUP002', name: 'Shree Garments', contactPerson: 'Amit', phone: '9876543211', openingBalance: 0, createdAt: new Date().toISOString() },
    { id: 'SUP003', name: 'Royal Sarees', contactPerson: 'Suresh', phone: '9876543212', openingBalance: 0, createdAt: new Date().toISOString() },
  ],
  transactions: [
    { id: 'TXN001', date: '2026-09-17', supplierId: 'SUP003', billRef: 'INV-3001', description: 'Sarees', purchase: 12000, payment: 0, paymentMode: 'Cash', remarks: 'Sample transaction', createdAt: new Date().toISOString() },
    { id: 'TXN002', date: '2026-09-17', supplierId: 'SUP001', billRef: 'INV-3002', description: 'Textiles', purchase: 10000, payment: 0, paymentMode: 'Bank Transfer', remarks: '', createdAt: new Date().toISOString() },
  ],
}

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE)
    return raw ? JSON.parse(raw) : seed
  } catch { return seed }
}

export function KhataProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(data))
  }, [data])

  const nextSupplierId = (suppliers) => {
    const nums = suppliers.map(s => Number(String(s.id).replace(/\D/g, ''))).filter(Boolean)
    return `SUP${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`
  }

  const value = useMemo(() => ({
    ...data,
    addSupplier: (input) => {
      const supplier = { ...input, id: nextSupplierId(data.suppliers), createdAt: new Date().toISOString() }
      setData(d => ({ ...d, suppliers: [...d.suppliers, supplier] }))
      return supplier
    },
    updateSupplier: (id, input) => setData(d => ({ ...d, suppliers: d.suppliers.map(s => s.id === id ? { ...s, ...input } : s) })),
    deleteSupplier: (id) => setData(d => ({ suppliers: d.suppliers.filter(s => s.id !== id), transactions: d.transactions.filter(t => t.supplierId !== id) })),
    addTransaction: (input) => setData(d => ({ ...d, transactions: [...d.transactions, { ...input, id: `TXN-${Date.now()}`, createdAt: new Date().toISOString() }] })),
    updateTransaction: (id, input) => setData(d => ({ ...d, transactions: d.transactions.map(t => t.id === id ? { ...t, ...input } : t) })),
    deleteTransaction: (id) => setData(d => ({ ...d, transactions: d.transactions.filter(t => t.id !== id) })),
    replaceData: (imported) => setData({ suppliers: imported.suppliers || [], transactions: imported.transactions || [] }),
    resetData: () => setData(seed),
  }), [data])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useKhata = () => {
  const value = useContext(Context)
  if (!value) throw new Error('useKhata must be used inside KhataProvider')
  return value
}
