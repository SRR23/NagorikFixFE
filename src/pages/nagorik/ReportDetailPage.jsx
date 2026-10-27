import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, mediaUrl } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

export default function ReportDetailPage() {
  const { reportId } = useParams()
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/api/reports/${reportId}/`)
      .then(setReport)
      .catch((err) => setError(formatError(err)))
  }, [reportId])

  if (error) {
    return <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
  }
  if (!report) return <p className="text-ink/55">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/app" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Back
      </Link>

      <div className="nf-panel space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {report.category?.name}
            </h2>
            <p className="text-ink/65">
              {report.union} · Ward {report.ward}
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <p className="whitespace-pre-wrap text-ink/85">{report.description}</p>

        {report.media?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {report.media.map((m) => (
              <a
                key={m.id}
                href={mediaUrl(m.file)}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-xl border border-line"
              >
                <img
                  src={mediaUrl(m.file)}
                  alt="Report evidence"
                  className="h-32 w-full object-cover"
                />
              </a>
            ))}
          </div>
        ) : null}

        <dl className="grid gap-2 text-sm text-ink/65 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-ink">District</dt>
            <dd>{report.district?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Submitted</dt>
            <dd>{new Date(report.created_at).toLocaleString()}</dd>
          </div>
          {report.assigned_to_detail ? (
            <div>
              <dt className="font-semibold text-ink">Assigned staff</dt>
              <dd>
                {report.assigned_to_detail.full_name || report.assigned_to_detail.phone}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  )
}
