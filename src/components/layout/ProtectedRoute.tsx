import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { canAccess, type Permission, type Role } from '@/lib/rbac'

interface ProtectedRouteProps {
  role?: Role
  permission?: Permission
  children: React.ReactNode
}

export function ProtectedRoute({ role, permission, children }: ProtectedRouteProps) {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" />
  
  if (role && user.role !== role) {
    return <Navigate to="/login" />
  }
  
  if (permission && !canAccess(user.role, permission)) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
