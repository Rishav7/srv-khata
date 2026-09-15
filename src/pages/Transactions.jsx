import { useMemo, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { Button, IconButton, Menu, MenuItem, TextField } from '@mui/material'
import SearchInput from '../components/common/SearchInput'
import Currency from '../components/common/Currency'
import ConfirmDialog from '../components/common/ConfirmDialog'
import TransactionForm from '../components/transactions/TransactionForm'
import { useKhata } from '../store/KhataContext'
import { formatDate } from '../utils/currency'
import { getSupplierTransactions, getRunningBalance } from '../utils/calculations'
import { useSearchParams } from 'react-router-dom'

export default function Transactions() {
 const {suppliers,transactions,addTransaction,updateTransaction,deleteTransaction}=useKhata()
 const [params]=useSearchParams();const [search,setSearch]=useState('');const [supplier,setSupplier]=useState(params.get('supplier')||'')
 const [formOpen,setFormOpen]=useState(false);const [editing,setEditing]=useState(null);const [deleteId,setDeleteId]=useState(null);const [anchor,setAnchor]=useState(null);const [menuId,setMenuId]=useState('')
 const supplierName=(id)=>suppliers.find(s=>s.id===id)?.name||'Unknown'
 const rows=useMemo(()=>{const base=transactions.filter(t=>(!supplier||t.supplierId===supplier)&&`${supplierName(t.supplierId)} ${t.billRef} ${t.description}`.toLowerCase().includes(search.toLowerCase()));return base.sort((a,b)=>b.date.localeCompare(a.date))},[transactions,supplier,search,suppliers])
 const save=(v)=>{editing?updateTransaction(editing.id,v):addTransaction(v);setFormOpen(false);setEditing(null)}
 return <div><div className="page-intro"><div><p className="eyebrow">LEDGER ENTRIES</p><h2>Transactions</h2><p>Record purchases, payments and supplier dues.</p></div><Button variant="contained" startIcon={<AddRoundedIcon/>} onClick={()=>{setEditing(null);setFormOpen(true)}}>Add Transaction</Button></div>
 <section className="panel"><div className="filter-bar"><SearchInput value={search} onChange={setSearch} placeholder="Search bill, description or supplier..." /><TextField select size="small" value={supplier} onChange={e=>setSupplier(e.target.value)} SelectProps={{native:true}} sx={{minWidth:190}}><option value="">All suppliers</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</TextField><button className="clear-button" onClick={()=>{setSearch('');setSupplier('')}}>Clear filters</button><span className="record-count">{rows.length} entries</span></div>
 <div className="table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Supplier</th><th>Bill / Ref No.</th><th>Description</th><th className="number">Purchase / Due</th><th className="number">Payment</th><th>Mode</th><th className="number">Balance</th><th>Actions</th></tr></thead><tbody>
 {rows.map(t=>{const supplierRows=getSupplierTransactions(t.supplierId,transactions);const running=getRunningBalance(suppliers.find(s=>s.id===t.supplierId),supplierRows).find(x=>x.id===t.id)?.balance??0;return <tr key={t.id}><td>{formatDate(t.date)}</td><td><strong>{supplierName(t.supplierId)}</strong></td><td>{t.billRef||'-'}</td><td>{t.description||'-'}{t.remarks&&<small className="muted-block">{t.remarks}</small>}</td><td className="number"><span className="purchase-value">{t.purchase? <Currency value={t.purchase}/>: '-'}</span></td><td className="number positive">{t.payment?<Currency value={t.payment}/>: '-'}</td><td><span className="mode-pill">{t.paymentMode}</span></td><td className="number amount-due"><Currency value={running}/></td><td><IconButton size="small" onClick={e=>{setAnchor(e.currentTarget);setMenuId(t.id)}}><MoreVertRoundedIcon/></IconButton></td></tr>})}
 {!rows.length&&<tr><td colSpan={9}><div className="empty-state"><h3>No transactions found</h3><p>Record your first purchase or payment.</p><Button variant="outlined" onClick={()=>setFormOpen(true)}>Add Transaction</Button></div></td></tr>}</tbody></table></div></section>
 <Menu anchorEl={anchor} open={!!anchor} onClose={()=>setAnchor(null)}><MenuItem onClick={()=>{setEditing(transactions.find(t=>t.id===menuId)||null);setFormOpen(true);setAnchor(null)}}>Edit Transaction</MenuItem><MenuItem sx={{color:'error.main'}} onClick={()=>{setDeleteId(menuId);setAnchor(null)}}>Delete Transaction</MenuItem></Menu>
 <TransactionForm open={formOpen} transaction={editing} suppliers={suppliers} onClose={()=>{setFormOpen(false);setEditing(null)}} onSave={save}/>
 <ConfirmDialog open={!!deleteId} title="Delete Transaction?" message="This ledger entry will be permanently removed." onClose={()=>setDeleteId(null)} onConfirm={()=>{if(deleteId)deleteTransaction(deleteId);setDeleteId(null)}}/>
 </div>
}
