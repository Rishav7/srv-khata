import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
const items=[
 ['Getting started','Start by adding your suppliers. Each supplier receives a stable Supplier ID such. Use Transactions to record purchases and payments.'],
 ['Supplier names are safe to edit','Transactions are linked to the stable Supplier ID, not the supplier name. You can rename a supplier without losing historical balances.'],
 ['Recording a purchase','Create a transaction, choose the supplier, enter the bill/reference number and purchase amount. The running balance increases automatically.'],
 ['Recording a payment','Enter a payment amount and choose Cash, UPI, Bank Transfer, Cheque or Other. The running balance decreases automatically.'],
 ['Excel import','Open Excel Import / Export, upload your .xlsx workbook and review the preview. The importer matches Supplier ID first and supplier name second.'],
 ['Backup','Use Export All Data regularly. The exported workbook contains supplier and transaction data that can be imported again.'],
]
export default function HowToUse(){return <div className="howto"><div className="page-intro"><div><p className="eyebrow">HELP CENTER</p><h2>How to Use</h2><p>A simple guide for managing your supplier khata.</p></div></div><section className="panel"><div className="panel__header"><div><h2>Supplier Khata Guide</h2><p>Everything you need for daily ledger operations.</p></div></div>{items.map(([q,a])=><Accordion key={q} disableGutters elevation={0}><AccordionSummary expandIcon={<ExpandMoreRoundedIcon/>}><strong>{q}</strong></AccordionSummary><AccordionDetails>{a}</AccordionDetails></Accordion>)}</section></div>}
