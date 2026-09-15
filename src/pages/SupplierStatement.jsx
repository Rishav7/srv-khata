import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import { Button, MenuItem, TextField } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useKhata } from '../store/KhataContext'
import { getSupplierTotals } from '../utils/calculations'
import StatementSummary from '../components/statements/StatementSummary'
import StatementTable from '../components/statements/StatementTable'
import { exportSupplierStatement } from '../utils/excel'
export default function SupplierStatement() {
 const {suppliers,transactions}=useKhata();const [params,setParams]=useSearchParams();const [id,setId]=useState(params.get('supplier')||suppliers[0]?.id||'')
 useEffect(()=>{if(id)setParams({supplier:id})},[id])
 const supplier=useMemo(()=>suppliers.find(s=>s.id===id),[suppliers,id]);if(!supplier)return <div className="empty-state"><h3>No supplier available</h3></div>
 const totals=getSupplierTotals(supplier,transactions)
 return <div><div className="page-intro"><div><p className="eyebrow">ACCOUNT LEDGER</p><h2>Supplier Statement</h2><p>Review the complete account history for a supplier.</p></div><div className="button-row"><Button variant="outlined" startIcon={<PrintRoundedIcon/>} onClick={()=>window.print()}>Print</Button><Button variant="contained" startIcon={<FileDownloadRoundedIcon/>} onClick={()=>exportSupplierStatement(supplier,transactions)}>Export Excel</Button></div></div>
 <section className="panel statement-head"><div><span className="eyebrow">SELECT SUPPLIER</span><TextField select size="small" value={id} onChange={e=>setId(e.target.value)} sx={{minWidth:300}}>{suppliers.map(s=><MenuItem key={s.id} value={s.id}>{s.name} · {s.id}</MenuItem>)}</TextField></div><div className="statement-contact"><strong>{supplier.name}</strong><span>{supplier.contactPerson||'No contact'} · {supplier.phone||'No phone'}</span></div></section>
 <StatementSummary {...totals}/><section className="panel"><div className="panel__header"><div><h2>{supplier.name}</h2><p>Detailed ledger with running balance</p></div></div><StatementTable supplier={supplier} transactions={transactions}/></section>
 </div>
}
