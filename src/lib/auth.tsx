import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'

interface AuthContextValue {
  user: User | null
  login: (role: UserRole, name: string, phone: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (role: UserRole, name: string, phone: string) => {
    setUser({ id: crypto.randomUUID(), name, phone, role })
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
