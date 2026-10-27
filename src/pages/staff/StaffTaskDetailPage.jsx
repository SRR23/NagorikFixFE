import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, mediaUrl } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

export default function StaffTaskDetailPage() {
  const { reportId } = useParams()
  const [task, setTask] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api(`/api/staff/tasks/${reportId}/`)
      .then(setTask)
      .catch((err) => setError(formatError(err)))
  }, [reportId])

  async function setStatus(next) {
    setBusy(true)
    setError('')
    try {
      const updated = await api(`/api/staff/tasks/${reportId}/status/`, {
        method: 'PATCH',
        json: { status: next },
      })
      setTask(updated)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setBusy(false)
    }
  }

  if (!task && !error) return <p className="text-ink/55">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/staff" className="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Tasks
      </Link>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}

      {task ? (
        <>
          <div className="nf-panel space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {task.category?.name}
                </h2>
                <p className="text-ink/65">
                  {task.union} · Ward {task.ward}
                </p>
              </div>
              <StatusBadge status={task.status} />
            </div>
            <p className="whitespace-pre-wrap">{task.description}</p>
            {task.media?.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {task.media.map((m) => (
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
            <h3 className="font-display text-lg font-bold">Update status</h3>
            <p className="text-sm text-ink/60">
              Start work, then mark resolved when the issue is fixed.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="nf-btn-ghost"
                disabled={busy || task.status === 'in_progress'}
                onClick={() => setStatus('in_progress')}
              >
                Mark in progress
              </button>
              <button
                type="button"
                className="nf-btn-primary"
                disabled={busy || task.status === 'resolved'}
                onClick={() => setStatus('resolved')}
              >
                Mark resolved
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
