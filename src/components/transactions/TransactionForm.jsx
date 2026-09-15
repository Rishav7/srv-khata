import { useEffect, useState } from 'react'
import { Button, Drawer, MenuItem, TextField } from '@mui/material'
const modes=['Cash','UPI','Bank Transfer','Cheque','Other']
const initial={date:new Date().toISOString().slice(0,10),supplierId:'',billRef:'',description:'',purchase:0,payment:0,paymentMode:'Cash',remarks:''}
export default function TransactionForm({ open, transaction, suppliers, onClose, onSave }) {
 const [form,setForm]=useState(initial);const [error,setError]=useState('')
 useEffect(()=>setForm(transaction?{date:transaction.date,supplierId:transaction.supplierId,billRef:transaction.billRef,description:transaction.description,purchase:transaction.purchase,payment:transaction.payment,paymentMode:transaction.paymentMode,remarks:transaction.remarks}:initial),[transaction,open])
 const update=(k,v)=>setForm(f=>({...f,[k]:v}))
 const submit=(e)=>{e.preventDefault();if(!form.supplierId){setError('Supplier is required');return}if(!form.purchase&&!form.payment){setError('Enter a purchase or payment amount');return}if(form.purchase<0||form.payment<0){setError('Amounts cannot be negative');return}setError('');onSave({...form,purchase:Number(form.purchase)||0,payment:Number(form.payment)||0})}
 return <Drawer anchor="right" open={open} onClose={onClose}><div className="drawer"><div className="drawer__head"><div><span className="eyebrow">{transaction?'EDIT TRANSACTION':'NEW TRANSACTION'}</span><h2>{transaction?'Edit transaction':'Record transaction'}</h2></div><button className="icon-close" onClick={onClose}>×</button></div>
 <form className="form" onSubmit={submit}><TextField label="Date" type="date" value={form.date} onChange={e=>update('date',e.target.value)} InputLabelProps={{shrink:true}} required/>
 <TextField select label="Supplier" value={form.supplierId} onChange={e=>update('supplierId',e.target.value)} required error={!!error&& !form.supplierId}><MenuItem value="">Select supplier</MenuItem>{suppliers.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}</TextField>
 <TextField label="Bill / Ref No." value={form.billRef} onChange={e=>update('billRef',e.target.value)}/><TextField label="Description" value={form.description} onChange={e=>update('description',e.target.value)}/>
 <div className="form-grid"><TextField label="Purchase / Due" type="number" value={form.purchase} onChange={e=>update('purchase',Number(e.target.value))}/><TextField label="Payment" type="number" value={form.payment} onChange={e=>update('payment',Number(e.target.value))}/></div>
 <TextField select label="Payment Mode" value={form.paymentMode} onChange={e=>update('paymentMode',e.target.value)}>{modes.map(m=><MenuItem key={m} value={m}>{m}</MenuItem>)}</TextField>
 <TextField label="Remarks" multiline minRows={3} value={form.remarks} onChange={e=>update('remarks',e.target.value)}/>{error&&<div className="form-error">{error}</div>}
 <div className="drawer__actions"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="contained">{transaction?'Save Changes':'Save Transaction'}</Button></div></form></div></Drawer>
}
