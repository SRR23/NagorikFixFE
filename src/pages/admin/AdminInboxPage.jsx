import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
]

export default function AdminInboxPage() {
  const [status, setStatus] = useState('pending')
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const query = status ? `?status=${status}` : ''
    Promise.all([
      api(`/api/admin/reports/${query}`),
      api('/api/admin/dashboard/stats/'),
    ])
      .then(([list, dashboard]) => {
        setReports(list.results || list)
        setStats(dashboard)
      })
      .catch((err) => setError(formatError(err)))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">District inbox</h2>
        <p className="text-sm text-ink/60">
          Review Nagorik reports and assign staff in your district.
        </p>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Pending', stats.pending],
            ['Assigned', stats.assigned],
            ['In progress', stats.in_progress],
            ['Resolved', stats.resolved],
          ].map(([label, value]) => (
            <div key={label} className="nf-panel py-4 text-center">
              <p className="font-display text-2xl font-bold text-ink">{value ?? 0}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || 'all'}
            type="button"
            className={status === f.value ? 'nf-btn-primary' : 'nf-btn-ghost'}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </button>
        ))}
        <Link to="/admin/approvals" className="nf-btn-ghost ml-auto">
          Pending approvals
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}
      {loading ? <p className="text-ink/55">Loading…</p> : null}

      {!loading && reports.length === 0 ? (
        <EmptyState title="No reports" body="Nothing in this filter right now." />
      ) : null}

      <ul className="space-y-3">
        {reports.map((report) => (
          <li key={report.id}>
            <Link
              to={`/admin/reports/${report.id}`}
              className="nf-panel block transition hover:border-ink/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {report.category?.name} · {report.union} / {report.ward}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">
                    {report.description}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
