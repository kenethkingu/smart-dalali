export type Role = 'buyer' | 'owner' | 'agent' | 'property_manager' | 'tenant' | 'inspector' | 'admin'

export type Permission =
  | 'view_public_listings'
  | 'request_site_visit'
  | 'manage_own_properties'
  | 'manage_leads'            // Agent
  | 'manage_portfolio'        // Property Manager
  | 'view_own_lease'          // Tenant
  | 'submit_inspection'       // Inspector
  | 'approve_properties'      // Admin
  | 'view_all_users'          // Admin

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  buyer: ['view_public_listings', 'request_site_visit'],
  owner: ['view_public_listings', 'manage_own_properties'],
  agent: ['view_public_listings', 'manage_leads', 'manage_own_properties'],
  property_manager: ['view_public_listings', 'manage_portfolio', 'manage_own_properties'],
  tenant: ['view_own_lease'],
  inspector: ['submit_inspection'],
  admin: ['approve_properties', 'view_all_users', 'manage_own_properties'],
}

export function canAccess(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export type Action =
  | 'history.view'
  | 'lease.view'
  | 'lease.manage'
  | 'tenancy.list'
  | 'renewal.respond'
  | 'rent.view'
  | 'rent.pay'
  | 'ticket.view'
  | 'ticket.create'
  | 'ticket.respond'
  | 'ticket.confirm'
  | 'document.view'
  | 'document.upload'
  | 'document.verify'
  | 'contract.view'
  | 'contract.sign'
  | 'inspection.record'

export interface Resource {
  ownerId?: string
  managerId?: string
  tenantId?: string
}

interface Actor {
  id: string
  role: Role
  roles?: Role[]
}

const ACTION_ROLES: Record<Action, Role[]> = {
  'history.view': ['owner', 'property_manager', 'tenant', 'admin'],
  'lease.view': ['owner', 'property_manager', 'tenant', 'admin'],
  'lease.manage': ['owner'],
  'tenancy.list': ['owner', 'property_manager', 'admin'],
  'renewal.respond': ['tenant'],
  'rent.view': ['tenant'],
  'rent.pay': ['tenant'],
  'ticket.view': ['owner', 'property_manager', 'tenant', 'admin'],
  'ticket.create': ['tenant'],
  'ticket.respond': ['owner', 'property_manager'],
  'ticket.confirm': ['tenant'],
  'document.view': ['owner', 'property_manager', 'tenant', 'admin'],
  'document.upload': ['owner', 'property_manager', 'tenant'],
  'document.verify': ['admin'],
  'contract.view': ['owner', 'tenant', 'admin'],
  'contract.sign': ['owner', 'tenant'],
  'inspection.record': ['property_manager', 'admin'],
}

const ROLE_BINDING: Partial<Record<Role, keyof Resource>> = {
  owner: 'ownerId',
  property_manager: 'managerId',
  tenant: 'tenantId',
}

export function userRoles(user: Actor): Role[] {
  return [user.role, ...(user.roles ?? [])]
}

function isBound(user: Actor, role: Role, resource: Resource | undefined): boolean {
  if (role === 'admin' || !resource) return true
  const key = ROLE_BINDING[role]
  return key !== undefined && resource[key] === user.id
}

export function can(user: Actor | null | undefined, action: Action, resource?: Resource): boolean {
  if (!user) return false
  return userRoles(user).some(role => ACTION_ROLES[action].includes(role) && isBound(user, role, resource))
}

const DASHBOARD_PATHS: Record<Role, string> = {
  buyer: '/buyer/dashboard',
  owner: '/owner/dashboard',
  agent: '/agent/dashboard',
  admin: '/admin/dashboard',
  tenant: '/tenant/dashboard',
  property_manager: '/owner/tenancies',
  inspector: '/',
}

export function dashboardPath(user: Actor): string {
  return DASHBOARD_PATHS[user.role]
}
