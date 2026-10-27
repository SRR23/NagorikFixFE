import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, mediaUrl } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

export default function AdminReportDetailPage() {
  const { reportId } = useParams()
  const [report, setReport] = useState(null)
  const [staff, setStaff] = useState([])
  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const [detail, staffList] = await Promise.all([
      api(`/api/admin/reports/${reportId}/`),
      api('/api/admin/staff/'),
    ])
    setReport(detail)
    setStaff(Array.isArray(staffList) ? staffList : staffList.results || [])
    if (detail.assigned_to) setStaffId(String(detail.assigned_to))
  }

  useEffect(() => {
    load().catch((err) => setError(formatError(err)))
  }, [reportId])

  async function assign() {
    setBusy(true)
    setError('')
    try {
      const updated = await api(`/api/admin/reports/${reportId}/assign/`, {
        method: 'POST',
        json: { staff_id: Number(staffId) },
      })
      setReport(updated)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setBusy(false)
    }
  }

  async function reject() {
    if (!window.confirm('Reject this report?')) return
    setBusy(true)
    setError('')
    try {
      const updated = await api(`/api/admin/reports/${reportId}/reject/`, {
        method: 'POST',
      })
      setReport(updated)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setBusy(false)
    }
  }

  if (!report && !error) return <p className="text-ink/55">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/admin" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Inbox
      </Link>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}

      {report ? (
        <>
          <div className="nf-panel space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {report.category?.name}
                </h2>
                <p className="text-ink/65">
                  {report.union} · Ward {report.ward}
                </p>
                <p className="mt-1 text-sm text-ink/50">
                  By {report.reporter?.full_name || report.reporter?.phone || '—'}
                </p>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <p className="whitespace-pre-wrap">{report.description}</p>

            {report.media?.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {report.media.map((m) => (
                  <img
                    key={m.id}
                    src={mediaUrl(m.file)}
                    alt=""
                    className="h-32 w-full rounded-xl border border-line object-cover"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="nf-panel space-y-3">
            <h3 className="font-display text-lg font-bold">Assign staff</h3>
            <select
              className="nf-input"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.phone} ({s.phone})
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="nf-btn-primary"
                disabled={!staffId || busy}
                onClick={assign}
              >
                Assign
              </button>
              <button
                type="button"
                className="nf-btn-ghost"
                disabled={busy || report.status === 'rejected'}
                onClick={reject}
              >
                Reject report
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
