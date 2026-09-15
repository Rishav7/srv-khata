import { formatCurrency } from '../../utils/currency'
export default function Currency({ value, className = '' }) {
  return <span className={className}>{formatCurrency(value)}</span>
}
