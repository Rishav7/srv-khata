export default function StatusBadge({ status }) {
  const value = String(status || '').toLowerCase()

  const statusClass = {
    outstanding: 'status-badge--outstanding',
    paid: 'status-badge--paid',
    pending: 'status-badge--pending',
  }

  return (
    <span className={`status-badge ${statusClass[value] || ''}`}>
      {status || 'N/A'}
    </span>
  )
}
