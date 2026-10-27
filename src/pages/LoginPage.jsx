import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { homeForRole, useAuth } from '../auth/AuthContext'
import { formatError } from '../lib/status'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const nextUser = await login(phone, password)
      navigate(homeForRole(nextUser.role), { replace: true })
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">
          NagorikFix
        </h1>
        <p className="mt-2 text-ink/65">
          Report local infrastructure issues. Track them until fixed.
        </p>
      </div>

      <form onSubmit={onSubmit} className="nf-panel space-y-4">
        <h2 className="font-display text-xl font-bold">Log in</h2>

        <div>
          <label className="nf-label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="nf-input"
            placeholder="017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="nf-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="nf-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <button type="submit" className="nf-btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-ink/65">
          New here?{' '}
          <Link className="font-semibold text-ink underline" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
