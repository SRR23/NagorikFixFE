import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth, homeForRole } from './auth/AuthContext'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApprovalsPage from './pages/admin/AdminApprovalsPage'
import AdminInboxPage from './pages/admin/AdminInboxPage'
import AdminReportDetailPage from './pages/admin/AdminReportDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyReportsPage from './pages/nagorik/MyReportsPage'
import NewReportPage from './pages/nagorik/NewReportPage'
import ReportDetailPage from './pages/nagorik/ReportDetailPage'
import StaffTaskDetailPage from './pages/staff/StaffTaskDetailPage'
import StaffTasksPage from './pages/staff/StaffTasksPage'

function RootRedirect() {
  const { user, booting } = useAuth()
  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center text-ink/60">
        Loading NagorikFix…
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={homeForRole(user.role)} replace />
}

const nagorikNav = [
  { to: '/app', label: 'My reports', end: true },
  { to: '/app/new', label: 'New report' },
]

const adminNav = [
  { to: '/admin', label: 'Inbox', end: true },
  { to: '/admin/approvals', label: 'Approvals' },
]

const staffNav = [{ to: '/staff', label: 'Tasks', end: true }]

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute roles={['nagorik']} />}>
            <Route
              path="/app"
              element={<AppShell title="Citizen reporting" navItems={nagorikNav} />}
            >
              <Route index element={<MyReportsPage />} />
              <Route path="new" element={<NewReportPage />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['administration']} />}>
            <Route
              path="/admin"
              element={
                <AppShell title="District administration" navItems={adminNav} />
              }
            >
              <Route index element={<AdminInboxPage />} />
              <Route path="approvals" element={<AdminApprovalsPage />} />
              <Route path="reports/:reportId" element={<AdminReportDetailPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['staff']} />}>
            <Route
              path="/staff"
              element={<AppShell title="Field staff" navItems={staffNav} />}
            >
              <Route index element={<StaffTasksPage />} />
              <Route path="tasks/:reportId" element={<StaffTaskDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
