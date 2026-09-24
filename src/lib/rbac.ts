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
