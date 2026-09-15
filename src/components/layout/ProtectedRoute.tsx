import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
export function ProtectedRoute({ role, children }: { role: string, children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user || user.role !== role) return <Navigate to="/login" />
  return <>{children}</>
}
