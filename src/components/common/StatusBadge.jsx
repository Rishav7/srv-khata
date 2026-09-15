export default function StatusBadge({ status, outstanding }) {
  const value = status ?? (Number(outstanding) > 0 ? 'outstanding' : 'paid')
  const normalized = String(value || '').toLowerCase()

  const statusClass = {
    outstanding: 'status-badge--outstanding',
    paid: 'status-badge--paid',
    pending: 'status-badge--pending',
  }

  const label =
    normalized === 'outstanding'
      ? 'Outstanding'
      : normalized === 'paid'
        ? 'Paid'
        : value || 'N/A'

  return (
    <span className={`status-badge ${statusClass[normalized] || ''}`}>
      {label}
    </span>
  )
}
