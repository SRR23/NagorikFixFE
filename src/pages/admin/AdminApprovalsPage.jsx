import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import EmptyState from '../../components/EmptyState'
import { formatError } from '../../lib/status'

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await api('/api/auth/pending-users/')
    setUsers(data.results || data)
  }

  useEffect(() => {
    load()
      .catch((err) => setError(formatError(err)))
      .finally(() => setLoading(false))
  }, [])

  async function approve(userId) {
    setError('')
    try {
      await api(`/api/auth/approve/${userId}/`, { method: 'POST' })
      await load()
    } catch (err) {
      setError(formatError(err))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/admin" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Inbox
        </Link>
        <h2 className="mt-2 font-display text-2xl font-bold">Pending approvals</h2>
        <p className="text-sm text-ink/60">
          Approve staff or administration accounts before they can log in.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
      ) : null}
      {loading ? <p className="text-ink/55">Loading…</p> : null}

      {!loading && users.length === 0 ? (
        <EmptyState title="No pending users" body="Everyone is approved." />
      ) : null}

      <ul className="space-y-3">
        {users.map((u) => (
          <li
            key={u.id}
            className="nf-panel flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold">
                {u.full_name || u.phone}{' '}
                <span className="text-sm font-normal capitalize text-ink/55">
                  ({u.role})
                </span>
              </p>
              <p className="text-sm text-ink/60">
                {u.phone}
                {u.district?.name ? ` · ${u.district.name}` : ''}
              </p>
            </div>
            <button
              type="button"
              className="nf-btn-primary"
              onClick={() => approve(u.id)}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
