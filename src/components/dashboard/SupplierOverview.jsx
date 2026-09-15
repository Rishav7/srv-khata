import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getSupplierTotals } from '../../utils/calculations'
import Currency from '../common/Currency'
import StatusBadge from '../common/StatusBadge'

export default function SupplierOverview({ suppliers, transactions }) {
  const navigate = useNavigate()
  return <section className="panel">
    <div className="panel__header"><div><h2>Supplier Outstanding</h2><p>Current payable balance across your suppliers</p></div><button className="text-button" onClick={() => navigate('/suppliers')}>View all suppliers →</button></div>
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Supplier</th><th>Contact</th><th>Purchased</th><th>Paid</th><th>Outstanding</th><th>Status</th><th className="actions-col">Actions</th></tr></thead>
    <tbody>{suppliers.slice(0,8).map(s => { const t=getSupplierTotals(s,transactions); return <tr key={s.id}>
      <td><div className="supplier-cell"><div className="supplier-avatar">{s.name.slice(0,1).toUpperCase()}</div><div><strong>{s.name}</strong><span>{s.id}</span></div></div></td>
      <td>{s.contactPerson || '-'}<small className="muted-block">{s.phone || ''}</small></td><td><Currency value={t.purchased}/></td><td className="positive"><Currency value={t.paid}/></td><td className="amount-due"><Currency value={t.outstanding}/></td><td><StatusBadge outstanding={t.outstanding}/></td>
      <td><Tooltip title="View statement"><IconButton size="small" onClick={() => navigate(`/statement?supplier=${s.id}`)}><VisibilityRoundedIcon fontSize="small"/></IconButton></Tooltip><Tooltip title="Add transaction"><IconButton size="small" onClick={() => navigate(`/transactions?supplier=${s.id}`)}><AddRoundedIcon fontSize="small"/></IconButton></Tooltip></td>
    </tr> })}</tbody></table></div>
  </section>
}
