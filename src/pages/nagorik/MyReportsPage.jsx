import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

export default function MyReportsPage() {
  const [reports, setReports] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/reports/')
      .then((data) => setReports(data.results || data))
      .catch((err) => setError(formatError(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">My reports</h2>
          <p className="text-sm text-ink/60">Track issues you submitted in your district.</p>
        </div>
        <Link to="/app/new" className="nf-btn-accent">
          New report
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}
      {loading ? <p className="text-ink/55">Loading…</p> : null}

      {!loading && reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          body="Capture a problem in your area — union, ward, description, and photos."
        />
      ) : null}

      <ul className="space-y-3">
        {reports.map((report) => (
          <li key={report.id}>
            <Link
              to={`/app/reports/${report.id}`}
              className="nf-panel block transition hover:border-ink/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {report.category?.name} · {report.union} / {report.ward}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">
                    {report.description}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <p className="mt-3 text-xs text-ink/45">
                {new Date(report.created_at).toLocaleString()}
                {report.photo_count != null ? ` · ${report.photo_count} photo(s)` : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
