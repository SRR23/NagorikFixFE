import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

function homeForRole(role) {
  if (role === 'administration') return '/admin'
  if (role === 'staff') return '/staff'
  return '/app'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nf_access')
    if (!token) {
      setBooting(false)
      return
    }
    api('/api/auth/me/')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('nf_access')
        localStorage.removeItem('nf_refresh')
      })
      .finally(() => setBooting(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      booting,
      homePath: user ? homeForRole(user.role) : '/login',
      async login(phone, password) {
        const data = await api('/api/auth/login/', {
          json: { phone, password },
        })
        localStorage.setItem('nf_access', data.tokens.access)
        localStorage.setItem('nf_refresh', data.tokens.refresh)
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        const data = await api('/api/auth/register/', { json: payload })
        if (data.tokens?.access) {
          localStorage.setItem('nf_access', data.tokens.access)
          localStorage.setItem('nf_refresh', data.tokens.refresh)
          setUser(data.user)
        }
        return data
      },
      async logout() {
        const refresh = localStorage.getItem('nf_refresh')
        try {
          if (refresh) {
            await api('/api/auth/logout/', { json: { refresh } })
          }
        } catch {
          /* ignore */
        }
        localStorage.removeItem('nf_access')
        localStorage.removeItem('nf_refresh')
        setUser(null)
      },
    }),
    [user, booting],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export { homeForRole }
