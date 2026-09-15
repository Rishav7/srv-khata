import { getSupplierTotals } from '../../utils/calculations'
import Currency from '../common/Currency'

export default function FinancialBars({ suppliers, transactions }) {
  const top = suppliers.map(s => ({ s, ...getSupplierTotals(s,transactions) })).filter(x => x.outstanding > 0).sort((a,b)=>b.outstanding-a.outstanding).slice(0,5)
  const max = Math.max(...top.map(x=>x.outstanding), 1)
  return <section className="panel"><div className="panel__header"><div><h2>Outstanding by Supplier</h2><p>Top suppliers by payable balance</p></div></div>
    <div className="bar-list">{top.length ? top.map(x=><div className="bar-row" key={x.s.id}><div className="bar-row__name"><span>{x.s.name}</span><strong><Currency value={x.outstanding}/></strong></div><div className="bar-track"><div className="bar-fill" style={{width:`${(x.outstanding/max)*100}%`}}/></div></div>) : <div className="empty-inline">No outstanding balances</div>}</div>
  </section>
}
