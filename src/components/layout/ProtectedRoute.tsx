import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { can, canAccess, type Action, type Permission, type Role } from '@/lib/rbac'
import { AccessDenied } from '@/features/management/shared/AccessDenied'

interface ProtectedRouteProps {
  role?: Role
  permission?: Permission
  action?: Action
  children: React.ReactNode
}

export function ProtectedRoute({ role, permission, action, children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />
  }

  const roleDenied = role !== undefined && user.role !== role
  const permissionDenied = permission !== undefined && !canAccess(user.role, permission)
  const actionDenied = action !== undefined && !can(user, action)
  if (roleDenied || permissionDenied || actionDenied) return <AccessDenied />

  return <>{children}</>
}
