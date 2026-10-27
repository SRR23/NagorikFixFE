import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { homeForRole, useAuth } from '../auth/AuthContext'
import { formatError } from '../lib/status'

const ROLES = [
  { value: 'nagorik', label: 'Nagorik', hint: 'Report problems in your area' },
  { value: 'staff', label: 'Staff', hint: 'Needs admin approval before login' },
  {
    value: 'administration',
    label: 'Administration',
    hint: 'Needs approval before login',
  },
]

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [districts, setDistricts] = useState([])
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    password: '',
    password_confirm: '',
    role: 'nagorik',
    district_id: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api('/api/districts/')
      .then(setDistricts)
      .catch((err) => setError(formatError(err)))
  }, [])

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await register({
        ...form,
        district_id: Number(form.district_id),
      })
      if (data.tokens?.access) {
        navigate(homeForRole(data.user.role), { replace: true })
      } else {
        setMessage(
          data.message ||
            'Account created. Wait for administration approval before logging in.',
        )
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">
          NagorikFix
        </h1>
        <p className="mt-2 text-ink/65">Create your account with phone + district.</p>
      </div>

      <form onSubmit={onSubmit} className="nf-panel space-y-4">
        <h2 className="font-display text-xl font-bold">Sign up</h2>

        <div>
          <label className="nf-label" htmlFor="full_name">
            Full name
          </label>
          <input
            id="full_name"
            className="nf-input"
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="nf-label" htmlFor="reg_phone">
            Phone
          </label>
          <input
            id="reg_phone"
            className="nf-input"
            placeholder="017XXXXXXXX"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="nf-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="nf-input"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="nf-label" htmlFor="password_confirm">
              Confirm
            </label>
            <input
              id="password_confirm"
              type="password"
              className="nf-input"
              value={form.password_confirm}
              onChange={(e) => update('password_confirm', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="nf-label" htmlFor="district">
            District
          </label>
          <select
            id="district"
            className="nf-input"
            value={form.district_id}
            onChange={(e) => update('district_id', e.target.value)}
            required
          >
            <option value="">Select district</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="nf-label">Role</legend>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <label
                key={role.value}
                className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 ${
                  form.role === role.value
                    ? 'border-ink bg-mist/70'
                    : 'border-line bg-white/50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  className="mt-1"
                  checked={form.role === role.value}
                  onChange={() => update('role', role.value)}
                />
                <span>
                  <span className="block font-semibold">{role.label}</span>
                  <span className="text-sm text-ink/60">{role.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}
        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-ink-soft">
            {message}{' '}
            <Link className="font-semibold underline" to="/login">
              Go to login
            </Link>
          </p>
        ) : null}

        <button type="submit" className="nf-btn-accent w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-ink/65">
          Already registered?{' '}
          <Link className="font-semibold text-ink underline" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
