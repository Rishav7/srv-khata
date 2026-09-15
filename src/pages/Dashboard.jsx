import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useKhata } from '../store/KhataContext'
import { getOverallTotals } from '../utils/calculations'
import StatCard from '../components/dashboard/StatCard'
import SupplierOverview from '../components/dashboard/SupplierOverview'
import FinancialBars from '../components/dashboard/FinancialBars'
import Currency from '../components/common/Currency'

export default function Dashboard() {
  const { suppliers, transactions } = useKhata()
  const navigate = useNavigate()
  const totals = getOverallTotals(suppliers, transactions)
  return <div className="dashboard">
    <div className="page-intro"><div><p className="eyebrow">BUSINESS OVERVIEW</p><h2>Good day, Admin</h2><p>Here is a quick view of your supplier accounts and cash position.</p></div><Button variant="contained" startIcon={<ArrowForwardRoundedIcon/>} onClick={()=>navigate('/transactions')}>Record Transaction</Button></div>
    <div className="stat-grid">
      <StatCard type="outstanding" label="Total Outstanding" value={totals.outstanding} helper="Amount payable to suppliers"/>
      <StatCard type="purchased" label="Total Purchased" value={totals.purchased} helper="Total supplier purchases"/>
      <StatCard type="paid" label="Total Paid" value={totals.paid} helper="Payments made"/>
      <StatCard type="suppliers" label="Suppliers With Due" value={totals.dueSuppliers} helper={`${suppliers.length} total suppliers`}/>
    </div>
    <div className="dashboard-grid"><div><SupplierOverview suppliers={suppliers} transactions={transactions}/></div><div><section className="panel quick-card"><div className="panel__header"><div><h2>Quick Summary</h2><p>At-a-glance financial position</p></div></div><div className="summary-list">
      <div><span>Opening Balance</span><strong><Currency value={totals.opening}/></strong></div>
      <div><span>Purchases</span><strong><Currency value={totals.purchased}/></strong></div>
      <div><span>Payments</span><strong className="positive"><Currency value={totals.paid}/></strong></div>
      <div className="summary-list__total"><span>Net Outstanding</span><strong><Currency value={totals.outstanding}/></strong></div>
    </div></section><FinancialBars suppliers={suppliers} transactions={transactions}/></div></div>
  </div>
}
