export const STATUS_LABELS = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
}

export const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-900',
  assigned: 'bg-sky-100 text-sky-900',
  in_progress: 'bg-indigo-100 text-indigo-900',
  resolved: 'bg-emerald-100 text-emerald-900',
  rejected: 'bg-rose-100 text-rose-900',
}

export function formatError(err) {
  if (!err) return 'Something went wrong'
  if (typeof err.data === 'string') return err.data
  if (err.data && typeof err.data === 'object') {
    if (typeof err.data.detail === 'string') return err.data.detail
    const parts = Object.entries(err.data).map(([key, value]) => {
      const text = Array.isArray(value) ? value.join(', ') : String(value)
      return `${key}: ${text}`
    })
    if (parts.length) return parts.join(' · ')
  }
  return err.message || 'Something went wrong'
}
