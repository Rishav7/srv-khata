import { useMemo, useState } from 'react'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SearchInput from '../components/common/SearchInput'
import Currency from '../components/common/Currency'
import StatusBadge from '../components/common/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import SupplierForm from '../components/suppliers/SupplierForm'
import { useKhata } from '../store/KhataContext'
import { getSupplierTotals } from '../utils/calculations'

export default function Suppliers() {
  const {suppliers,transactions,addSupplier,updateSupplier,deleteSupplier}=useKhata()
  const [search,setSearch]=useState('');const [editing,setEditing]=useState(null);const [formOpen,setFormOpen]=useState(false)
  const [deleteId,setDeleteId]=useState(null);const [anchor,setAnchor]=useState(null);const [menuId,setMenuId]=useState('')
  const navigate=useNavigate()
  const rows=useMemo(()=>suppliers.filter(s=>`${s.name} ${s.contactPerson} ${s.phone} ${s.id}`.toLowerCase().includes(search.toLowerCase())),[suppliers,search])
  const save=(v)=>{editing?updateSupplier(editing.id,v):addSupplier(v);setFormOpen(false);setEditing(null)}
  return <div><div className="page-intro"><div><p className="eyebrow">SUPPLIER DIRECTORY</p><h2>Supplier Management</h2><p>Manage supplier details and outstanding balances.</p></div><Button variant="contained" startIcon={<AddRoundedIcon/>} onClick={()=>{setEditing(null);setFormOpen(true)}}>Add Supplier</Button></div>
    <section className="panel"><div className="toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search supplier, contact or phone..." /><span className="record-count">{rows.length} suppliers</span></div>
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Supplier</th><th>Contact</th><th>Opening</th><th>Purchased</th><th>Paid</th><th>Outstanding</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    {rows.map(s=>{const t=getSupplierTotals(s,transactions);return <tr key={s.id}><td><div className="supplier-cell"><div className="supplier-avatar">{s.name.slice(0,1)}</div><div><strong>{s.name}</strong><span>{s.id}</span></div></div></td><td>{s.contactPerson||'-'}<small className="muted-block">{s.phone}</small></td><td><Currency value={t.opening}/></td><td><Currency value={t.purchased}/></td><td className="positive"><Currency value={t.paid}/></td><td className="amount-due"><Currency value={t.outstanding}/></td><td><StatusBadge outstanding={t.outstanding}/></td><td><IconButton size="small" onClick={e=>{setAnchor(e.currentTarget);setMenuId(s.id)}}><MoreVertRoundedIcon/></IconButton></td></tr>})}
    {!rows.length&&<tr><td colSpan={8}><div className="empty-state"><h3>No suppliers found</h3><p>Try another search or add a new supplier.</p></div></td></tr>}</tbody></table></div></section>
    <Menu anchorEl={anchor} open={!!anchor} onClose={()=>setAnchor(null)}><MenuItem onClick={()=>{navigate(`/statement?supplier=${menuId}`);setAnchor(null)}}>View Statement</MenuItem><MenuItem onClick={()=>{const s=suppliers.find(x=>x.id===menuId)||null;setEditing(s);setFormOpen(true);setAnchor(null)}}>Edit Supplier</MenuItem><MenuItem onClick={()=>{setDeleteId(menuId);setAnchor(null)}} sx={{color:'error.main'}}>Delete Supplier</MenuItem></Menu>
    <SupplierForm open={formOpen} supplier={editing} onClose={()=>{setFormOpen(false);setEditing(null)}} onSave={save}/>
    <ConfirmDialog open={!!deleteId} title="Delete Supplier?" message="This will also remove this supplier's transactions. This action cannot be undone." onClose={()=>setDeleteId(null)} onConfirm={()=>{if(deleteId)deleteSupplier(deleteId);setDeleteId(null)}}/>
  </div>
}
