"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, Check, Search } from "lucide-react";
import {
    useRoles,
    usePolicies,
    useAllPermissions,
    useCreateRole,
    useUpdateRole,
    useDeleteRole
} from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
interface Role {
    id: number;
    name: string;
    description?: string;
    policy_ids: number[];
    permission_ids: number[];
    is_default: boolean;
    created_at: string;
}

interface Policy {
    id: number;
    name: string;
    description?: string;
}

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface ListResponse<T> {
    items: T[];
    total: number;
    skip?: number;
    limit?: number;
}

export default function RolesTabSWR() {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        policy_ids: [] as number[],
        permission_ids: [] as number[],
        is_default: false
    });

    const itemsPerPage = 10;

    // Debounced search with 500ms delay
    const debouncedSearch = useDebounce((query: string) => {
        setDebouncedSearchTerm(query);
        setCurrentPage(0); // Reset to first page when searching
    }, 500);

    // Update debounced search term when searchTerm changes
    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Use SWR hooks for data fetching - use debouncedSearchTerm instead of searchTerm
    const {
        data: rolesResponse,
        error: rolesError,
        isLoading: rolesLoading,
        mutate: mutateRoles
    } = useRoles(currentPage, itemsPerPage, debouncedSearchTerm);

    const { data: policiesResponse } = usePolicies();
    const { data: permissionsResponse } = useAllPermissions();

    // Use SWR mutation hooks
    const { trigger: createRole } = useCreateRole();
    const { trigger: updateRole } = useUpdateRole();
    const { trigger: deleteRole } = useDeleteRole();

    // Extract data from responses
    const rolesData = rolesResponse as ListResponse<Role> | undefined;
    const policiesData = policiesResponse as ListResponse<Policy> | undefined;
    const permissionsData = permissionsResponse as ListResponse<Permission> | undefined;

    const roles = rolesData?.items || [];
    const total = rolesData?.total || 0;
    const totalPages = Math.ceil(total / itemsPerPage);
    const policies = policiesData?.items || [];
    const permissions = permissionsData?.items || [];
    const error = rolesError?.message;

    const handleCreate = async () => {
        try {
            await createRole(formData);
            setIsCreating(false);
            setFormData({
                name: '',
                description: '',
                policy_ids: [],
                permission_ids: [],
                is_default: false
            });
            // Refresh the roles data
            mutateRoles();
        } catch (err) {
            console.error('Failed to create role:', err);
        }
    };

    const handleUpdate = async () => {
        if (!editingRole) return;
        try {
            await updateRole({
                id: editingRole.id.toString(),
                data: {
                    description: formData.description,
                    policy_ids: formData.policy_ids,
                    permission_ids: formData.permission_ids,
                    is_default: formData.is_default
                }
            });
            setEditingRole(null);
            setFormData({
                name: '',
                description: '',
                policy_ids: [],
                permission_ids: [],
                is_default: false
            });
            // Refresh the roles data
            mutateRoles();
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    const handleDelete = async (roleId: number) => {
        if (!confirm('Are you sure you want to delete this role?')) return;

        try {
            await deleteRole(roleId.toString());
            // Refresh the roles data
            mutateRoles();
        } catch (err) {
            console.error('Failed to delete role:', err);
        }
    };

    const startEditing = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            policy_ids: role.policy_ids,
            permission_ids: role.permission_ids,
            is_default: role.is_default
        });
    };

    const cancelEditing = () => {
        setEditingRole(null);
        setIsCreating(false);
        setFormData({
            name: '',
            description: '',
            policy_ids: [],
            permission_ids: [],
            is_default: false
        });
    };

    // Search with debounce effect handled by SWR's deduping
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0); // Reset to first page when searching
    };

    if (rolesLoading && roles.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading roles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Button onClick={() => mutateRoles()} variant="outline">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Roles Management</h3>
                    <p className="text-sm text-slate-600">Manage user roles and permissions</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Role
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingRole) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</CardTitle>
                        <CardDescription>
                            {editingRole ? 'Update role details and permissions' : 'Add a new role with specific permissions'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="roleName">Role Name</Label>
                            <Input
                                id="roleName"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter role name"
                                disabled={!!editingRole} // Can't edit name
                            />
                        </div>

                        <div>
                            <Label htmlFor="roleDescription">Description</Label>
                            <Input
                                id="roleDescription"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter role description"
                            />
                        </div>

                        {/* Policies Selection */}
                        <div>
                            <Label>Policies</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {policies.map((policy: Policy) => (
                                    <label key={policy.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.policy_ids.includes(policy.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        policy_ids: [...prev.policy_ids, policy.id]
                                                    }));
                                                } else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        policy_ids: prev.policy_ids.filter(id => id !== policy.id)
                                                    }));
                                                }
                                            }}
                                        />
                                        <span className="text-sm">{policy.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Permissions Selection */}
                        <div>
                            <Label>Permissions</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                                {permissions.map((permission: Permission) => (
                                    <label key={permission.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.permission_ids.includes(permission.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        permission_ids: [...prev.permission_ids, permission.id]
                                                    }));
                                                } else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        permission_ids: prev.permission_ids.filter(id => id !== permission.id)
                                                    }));
                                                }
                                            }}
                                        />
                                        <span className="text-sm">{permission.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.is_default}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                            />
                            <Label htmlFor="isDefault">Default Role</Label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={cancelEditing}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={editingRole ? handleUpdate : handleCreate}
                                disabled={!formData.name}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                {editingRole ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Roles List */}
            <Card>
                <CardHeader>
                    <CardTitle>Roles ({total})</CardTitle>
                </CardHeader>
                <CardContent>
                    {roles.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No roles found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {roles.map((role: Role) => (
                                <div key={role.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-medium">{role.name}</h4>
                                                {role.is_default && (
                                                    <Badge variant="secondary">Default</Badge>
                                                )}
                                            </div>
                                            {role.description && (
                                                <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                                            )}
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                                                <span>{role.policy_ids.length} policies</span>
                                                <span>{role.permission_ids.length} permissions</span>
                                                <span>Created: {new Date(role.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startEditing(role)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(role.id)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-slate-600">
                                Showing {currentPage * itemsPerPage + 1} to{" "}
                                {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} roles
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}