import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { useManagementState } from '@/services/management/store'
import { withTenantRole } from '@/services/management/tenantRole'

interface AuthContextValue {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [baseUser, setBaseUser] = useState<User | null>(null)
  const leases = useManagementState(state => state.leases)
  const user = useMemo(() => (baseUser ? withTenantRole(baseUser, leases) : null), [baseUser, leases])

  const value = useMemo(
    () => ({ user, login: setBaseUser, logout: () => setBaseUser(null) }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
