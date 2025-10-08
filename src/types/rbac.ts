// RBAC types matching backend API models

export interface PolicyBase {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface PolicyCreate extends PolicyBase {
  is_system?: boolean;
}

export interface PolicyUpdate {
  description?: string;
}

export interface Policy extends PolicyBase {
  id: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionBase {
  name: string;
  description?: string;
}

export interface PermissionCreate extends PermissionBase {
  policy_ids?: number[];
  is_system?: boolean;
}

export interface PermissionUpdate {
  description?: string;
  policy_ids?: number[];
}

export interface Permission extends PermissionBase {
  id: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  policies: Policy[];
}

export interface RoleBase {
  name: string;
  description?: string;
}

export interface RoleCreate extends RoleBase {
  policy_ids?: number[];
  permission_ids?: number[];
  is_system?: boolean;
  is_default?: boolean;
}

export interface RoleUpdate {
  description?: string;
  policy_ids?: number[];
  permission_ids?: number[];
  is_default?: boolean;
}

export interface Role extends RoleBase {
  id: number;
  is_system: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  policies: Policy[];
  permissions: Permission[];
}

export interface UserRoleAssignment {
  user_id: string;
  role_ids: number[];
}

export interface UserWithRoles {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip?: number;
  limit?: number;
}

// API Response types
export type PolicyResponse = Policy;
export type PermissionResponse = Permission;
export type RoleResponse = Role;
export type UserRoleResponse = UserWithRoles;

export type PolicyListResponse = PaginatedResponse<Policy>;
export type PermissionListResponse = PaginatedResponse<Permission>;
export type RoleListResponse = PaginatedResponse<Role>;
export type UserListResponse = PaginatedResponse<UserWithRoles>;

// API Error type
export interface APIError {
  detail: string;
  status?: number;
}