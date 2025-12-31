import {
  Policy, PolicyCreate, PolicyUpdate, PolicyListResponse,
  Permission, PermissionCreate, PermissionUpdate, PermissionListResponse,
  Role, RoleCreate, RoleUpdate, RoleListResponse,
  UserWithRoles, UserRoleAssignment, UserListResponse
} from '@/types/rbac';
import CookieManager from '@/lib/cookie-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class RBACService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/rbac${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get auth token from cookie
    const token = CookieManager.getCookie('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
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

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Policy Management
  async listPolicies(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<PolicyListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PolicyListResponse>(`/policies${query ? `?${query}` : ''}`);
  }

  async getPolicy(id: number): Promise<Policy> {
    return this.request<Policy>(`/policies/${id}`);
  }

  async createPolicy(policy: PolicyCreate): Promise<Policy> {
    return this.request<Policy>('/policies', {
      method: 'POST',
      body: JSON.stringify(policy),
    });
  }

  async updatePolicy(id: number, policy: PolicyUpdate): Promise<Policy> {
    return this.request<Policy>(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policy),
    });
  }

  async deletePolicy(id: number): Promise<void> {
    return this.request<void>(`/policies/${id}`, {
      method: 'DELETE',
    });
  }

  // Permission Management
  async listPermissions(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<PermissionListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PermissionListResponse>(`/permissions${query ? `?${query}` : ''}`);
  }

  async getPermission(id: number): Promise<Permission> {
    return this.request<Permission>(`/permissions/${id}`);
  }

  async createPermission(permission: PermissionCreate): Promise<Permission> {
    return this.request<Permission>('/permissions', {
      method: 'POST',
      body: JSON.stringify(permission),
    });
  }

  async updatePermission(id: number, permission: PermissionUpdate): Promise<Permission> {
    return this.request<Permission>(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(permission),
    });
  }

  async deletePermission(id: number): Promise<void> {
    return this.request<void>(`/permissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Role Management
  async listRoles(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<RoleListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return this.request<RoleListResponse>(`/roles${query ? `?${query}` : ''}`);
  }

  async getRole(id: number): Promise<Role> {
    return this.request<Role>(`/roles/${id}`);
  }

  async createRole(role: RoleCreate): Promise<Role> {
    return this.request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: number, role: RoleUpdate): Promise<Role> {
    return this.request<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: number): Promise<void> {
    return this.request<void>(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // User Role Management
  async listUsersWithRoles(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return this.request<UserListResponse>(`/users${query ? `?${query}` : ''}`);
  }

  async getUserRoles(userId: string): Promise<UserWithRoles> {
    return this.request<UserWithRoles>(`/users/${userId}/roles`);
  }

  async assignRolesToUser(assignment: UserRoleAssignment): Promise<UserWithRoles> {
    return this.request<UserWithRoles>('/users/assign-roles', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  async removeRoleFromUser(userId: string, roleId: number): Promise<void> {
    return this.request<void>(`/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  // Helper method to get current user's policies
  async getMyPolicies(): Promise<Policy[]> {
    return this.request<Policy[]>('/my-policies');
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const rbacService = new RBACService();
export default rbacService;