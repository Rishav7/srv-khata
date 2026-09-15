import { getRunningBalance } from '../../utils/calculations'
import { formatDate } from '../../utils/currency'
import Currency from '../common/Currency'
export default function StatementTable({ supplier, transactions }) {
 const rows=transactions.filter(t=>t.supplierId===supplier.id).sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt));const running=getRunningBalance(supplier,rows)
 return <div className="table-wrap"><table className="data-table ledger-table"><thead><tr><th>Date</th><th>Bill / Ref No.</th><th>Description</th><th>Type</th><th className="number">Purchase / Due</th><th className="number">Payment</th><th>Mode</th><th className="number">Balance</th></tr></thead><tbody>
 {running.map(t=><tr key={t.id}><td>{formatDate(t.date)}</td><td>{t.billRef||'-'}</td><td>{t.description||'-'}</td><td><span className={t.purchase>0?'type-badge type-badge--purchase':'type-badge type-badge--payment'}>{t.purchase>0?'Purchase':'Payment'}</span></td><td className="number">{t.purchase?<Currency value={t.purchase}/>: '-'}</td><td className="number positive">{t.payment?<Currency value={t.payment}/>: '-'}</td><td>{t.paymentMode}</td><td className="number amount-due"><Currency value={t.balance}/></td></tr>)}
 {!running.length&&<tr><td colSpan={8}><div className="empty-state"><h3>No transactions for this supplier</h3><p>Add a purchase or payment to build the statement.</p></div></td></tr>}</tbody></table></div>
}
