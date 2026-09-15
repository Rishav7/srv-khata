import { useEffect, useState } from 'react'
import { Button, Drawer, TextField } from '@mui/material'
export default function SupplierForm({ open, supplier, onClose, onSave }) {
  const [form,setForm]=useState({name:'',contactPerson:'',phone:'',openingBalance:0})
  const [error,setError]=useState('')
  useEffect(()=>setForm(supplier ? {name:supplier.name,contactPerson:supplier.contactPerson,phone:supplier.phone,openingBalance:supplier.openingBalance} : {name:'',contactPerson:'',phone:'',openingBalance:0}),[supplier,open])
  const submit=(e)=>{e.preventDefault();if(!form.name.trim()){setError('Supplier name is required');return}setError('');onSave({...form,openingBalance:Number(form.openingBalance)||0});}
  return <Drawer anchor="right" open={open} onClose={onClose}><div className="drawer"><div className="drawer__head"><div><span className="eyebrow">{supplier?'EDIT SUPPLIER':'NEW SUPPLIER'}</span><h2>{supplier?'Edit supplier':'Add supplier'}</h2></div><button className="icon-close" onClick={onClose}>×</button></div>
    <form onSubmit={submit} className="form"><TextField label="Supplier Name" required value={form.name} error={!!error} helperText={error} onChange={e=>setForm({...form,name:e.target.value})}/>
    <TextField label="Contact Person" value={form.contactPerson} onChange={e=>setForm({...form,contactPerson:e.target.value})}/>
    <TextField label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
    <TextField label="Opening Balance" type="number" value={form.openingBalance} onChange={e=>setForm({...form,openingBalance:Number(e.target.value)})}/>
    <div className="drawer__actions"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="contained">{supplier?'Save Changes':'Save Supplier'}</Button></div></form>
  </div></Drawer>
}
