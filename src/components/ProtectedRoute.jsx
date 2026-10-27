import { Navigate, Outlet } from 'react-router-dom'
import { homeForRole, useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ roles }) {
  const { user, booting } = useAuth()

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center text-ink/60">
        Loading NagorikFix…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <Outlet />
}
