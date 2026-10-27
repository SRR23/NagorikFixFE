import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { formatError } from '../../lib/status'

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/staff/tasks/')
      .then((data) => setTasks(data.results || data))
      .catch((err) => setError(formatError(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">My tasks</h2>
        <p className="text-sm text-ink/60">
          Reports assigned to you. Mark in progress, then resolved when fixed.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}
      {loading ? <p className="text-ink/55">Loading…</p> : null}

      {!loading && tasks.length === 0 ? (
        <EmptyState title="No tasks yet" body="Wait for administration to assign work." />
      ) : null}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link
              to={`/staff/tasks/${task.id}`}
              className="nf-panel block transition hover:border-ink/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {task.category?.name} · {task.union} / {task.ward}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">
                    {task.description}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
