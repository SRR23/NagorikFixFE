import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function linkClass({ isActive }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-semibold transition',
    isActive ? 'bg-ink text-mist' : 'text-ink/70 hover:bg-white/70 hover:text-ink',
  ].join(' ')
}

export default function AppShell({ navItems, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            NagorikFix
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {title}
            {user?.district?.name ? ` · ${user.district.name}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-semibold text-ink">{user?.full_name || user?.phone}</p>
            <p className="capitalize text-ink/55">{user?.role}</p>
          </div>
          <button type="button" className="nf-btn-ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
