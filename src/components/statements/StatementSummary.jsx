import Currency from '../common/Currency'
export default function StatementSummary({ opening, purchased, paid, outstanding }) {
 return <div className="statement-summary"><div><span>Opening Balance</span><strong><Currency value={opening}/></strong></div><div><span>Total Purchased</span><strong><Currency value={purchased}/></strong></div><div><span>Total Paid</span><strong className="positive"><Currency value={paid}/></strong></div><div className="statement-summary__due"><span>Current Outstanding</span><strong><Currency value={outstanding}/></strong></div></div>
}
