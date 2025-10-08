import { API_ENDPOINTS } from "@/lib/api-config";
import { authService } from "@/lib/auth";
import {
  UserListResponse,
  UserRoleAssignment,
  UserWithRoles,
  Role,
  Permission,
  Policy,
  RoleListResponse,
  PermissionListResponse,
  PolicyListResponse,
  RoleCreate,
  RoleUpdate,
  PermissionCreate,
  PermissionUpdate,
  PolicyCreate,
  PolicyUpdate
} from "@/types/rbac";

export interface UserSearchParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export interface RoleSearchParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export interface PermissionSearchParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export interface PolicySearchParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export class UsersService {
  private static async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Get auth headers from AuthService (includes Bearer token and Content-Type)
    const authHeaders = authService.getAuthHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // User Management Methods
  static async listUsersWithRoles(params: UserSearchParams = {}): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_ENDPOINTS.users.list}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<UserListResponse>(url);
  }

  static async assignUserRoles(userId: string, roleIds: number[]): Promise<void> {
    const assignment: UserRoleAssignment = {
      user_id: userId,
      role_ids: roleIds
    };

    return this.makeRequest<void>(API_ENDPOINTS.users.assignRole, {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  static async removeUserRole(userId: string, roleId: number): Promise<void> {
    return this.makeRequest<void>(API_ENDPOINTS.users.removeRole(userId, roleId), {
      method: 'DELETE',
    });
  }

  static async getUserRoles(userId: string): Promise<UserWithRoles> {
    return this.makeRequest<UserWithRoles>(API_ENDPOINTS.users.getUserRoles(userId));
  }

  // Role Management Methods
  static async listRoles(params: RoleSearchParams = {}): Promise<RoleListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_ENDPOINTS.rbac.roles}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<RoleListResponse>(url);
  }

  static async createRole(roleData: RoleCreate): Promise<Role> {
    return this.makeRequest<Role>(API_ENDPOINTS.rbac.roles, {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  static async updateRole(roleId: number, roleData: RoleUpdate): Promise<Role> {
    return this.makeRequest<Role>(`${API_ENDPOINTS.rbac.roles}/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  static async deleteRole(roleId: number): Promise<void> {
    return this.makeRequest<void>(`${API_ENDPOINTS.rbac.roles}/${roleId}`, {
      method: 'DELETE',
    });
  }

  // Permission Management Methods
  static async listPermissions(params: PermissionSearchParams = {}): Promise<PermissionListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_ENDPOINTS.rbac.permissions}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<PermissionListResponse>(url);
  }

  static async createPermission(permissionData: PermissionCreate): Promise<Permission> {
    return this.makeRequest<Permission>(API_ENDPOINTS.rbac.permissions, {
      method: 'POST',
      body: JSON.stringify(permissionData),
    });
  }

  static async updatePermission(permissionId: number, permissionData: PermissionUpdate): Promise<Permission> {
    return this.makeRequest<Permission>(`${API_ENDPOINTS.rbac.permissions}/${permissionId}`, {
      method: 'PUT',
      body: JSON.stringify(permissionData),
    });
  }

  static async deletePermission(permissionId: number): Promise<void> {
    return this.makeRequest<void>(`${API_ENDPOINTS.rbac.permissions}/${permissionId}`, {
      method: 'DELETE',
    });
  }

  // Policy Management Methods
  static async listPolicies(params: PolicySearchParams = {}): Promise<PolicyListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_ENDPOINTS.rbac.policies}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<PolicyListResponse>(url);
  }

  static async createPolicy(policyData: PolicyCreate): Promise<Policy> {
    return this.makeRequest<Policy>(API_ENDPOINTS.rbac.policies, {
      method: 'POST',
      body: JSON.stringify(policyData),
    });
  }

  static async updatePolicy(policyId: number, policyData: PolicyUpdate): Promise<Policy> {
    return this.makeRequest<Policy>(`${API_ENDPOINTS.rbac.policies}/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify(policyData),
    });
  }

  static async deletePolicy(policyId: number): Promise<void> {
    return this.makeRequest<void>(`${API_ENDPOINTS.rbac.policies}/${policyId}`, {
      method: 'DELETE',
    });
  }

  // Bulk operations for efficiency
  static async getAllUserData(params: UserSearchParams = {}) {
    try {
      const [users, roles] = await Promise.all([
        this.listUsersWithRoles(params),
        this.listRoles()
      ]);

      return { users, roles };
    } catch (error) {
      console.error("Error loading user data:", error);
      throw error;
    }
  }

  static async getAllRBACData() {
    try {
      const [users, roles, permissions, policies] = await Promise.all([
        this.listUsersWithRoles(),
        this.listRoles(),
        this.listPermissions(),
        this.listPolicies()
      ]);

      return { users, roles, permissions, policies };
    } catch (error) {
      console.error("Error loading RBAC data:", error);
      throw error;
    }
  }
}

export default UsersService;