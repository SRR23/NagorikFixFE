import { STATUS_LABELS, STATUS_STYLES } from '../lib/status'

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-sand text-ink'}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
