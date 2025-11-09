'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Save,
    X,
    Star
} from 'lucide-react';
import { Role, RoleCreate, Policy, Permission } from '@/types/rbac';
import { useRoles, usePolicies, useAllPermissions, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';

export default function RolesTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<RoleCreate>({
        name: '',
        description: '',
        policy_ids: [],
        permission_ids: [],
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

    // SWR hooks - use debouncedSearchTerm instead of searchTerm
    const { data: rolesData, isLoading: loading, error: rolesError, mutate: mutateRoles } = useRoles(currentPage, itemsPerPage, debouncedSearchTerm);
    const { data: policiesData } = usePolicies();
    const { data: permissionsData } = useAllPermissions();
    const { trigger: createRole } = useCreateRole();
    const { trigger: updateRole } = useUpdateRole();
    const { trigger: deleteRole } = useDeleteRole();

    const roles = (rolesData as { items?: Role[] })?.items || [];
    const totalPages = rolesData ? Math.ceil((rolesData as { total: number }).total / itemsPerPage) : 0;
    const total = (rolesData as { total?: number })?.total || 0;
    const policies = (policiesData as { items?: Policy[] })?.items || [];
    const permissions = (permissionsData as { items?: Permission[] })?.items || [];
    const error = rolesError?.message || null;

    const handleDelete = async (roleId: number) => {
        try {
            await deleteRole(String(roleId));
            mutateRoles(); // Refresh the data
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to delete role');
        }
    };

    // Reset form function
    const resetForm = () => {
        setEditingRole(null);
        setIsCreating(false);
        setFormData({ name: '', description: '', policy_ids: [], permission_ids: [], is_default: false });
    };

    const startEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            policy_ids: role.policies.map((p: { id: number }) => p.id),
            permission_ids: role.permissions.map((p: { id: number }) => p.id),
            is_default: role.is_default
        });
    };

    const togglePolicy = (policyId: number) => {
        const newPolicyIds = formData.policy_ids?.includes(policyId)
            ? formData.policy_ids.filter(id => id !== policyId)
            : [...(formData.policy_ids || []), policyId];
        setFormData({ ...formData, policy_ids: newPolicyIds });
    };

    const togglePermission = (permissionId: number) => {
        const newPermissionIds = formData.permission_ids?.includes(permissionId)
            ? formData.permission_ids.filter(id => id !== permissionId)
            : [...(formData.permission_ids || []), permissionId];
        setFormData({ ...formData, permission_ids: newPermissionIds });
    };

    const handleCreate = async () => {
        try {
            await createRole(formData);
            mutateRoles();
            resetForm();
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to create role');
        }
    };

    const handleUpdate = async () => {
        if (!editingRole) return;
        try {
            await updateRole({ id: String(editingRole.id), data: formData });
            mutateRoles();
            resetForm();
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to update role');
        }
    };

    const cancelEdit = () => {
        resetForm();
    };

    if (loading) {
        return <div className="text-center py-8">Loading roles...</div>;
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Search and Add */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                </Button>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingRole) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{isCreating ? 'Create Role' : 'Edit Role'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!!editingRole}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default || false}
                                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="is_default">Default role for new users</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Policies</Label>
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                    {policies.map((policy: Policy) => (
                                        <div key={policy.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`policy-${policy.id}`}
                                                checked={formData.policy_ids?.includes(policy.id) || false}
                                                onChange={() => togglePolicy(policy.id)}
                                                className="rounded"
                                            />
                                            <label htmlFor={`policy-${policy.id}`} className="flex-1 text-sm">
                                                {policy.name}
                                                <span className="text-gray-500 ml-2">({policy.resource}:{policy.action})</span>
                                            </label>
                                            {policy.is_system && <Badge variant="secondary" className="text-xs">System</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>Permissions</Label>
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                    {permissions.map((permission: Permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`permission-${permission.id}`}
                                                checked={formData.permission_ids?.includes(permission.id) || false}
                                                onChange={() => togglePermission(permission.id)}
                                                className="rounded"
                                            />
                                            <label htmlFor={`permission-${permission.id}`} className="flex-1 text-sm">
                                                {permission.name}
                                                <span className="text-gray-500 ml-2">({permission.policies.length} policies)</span>
                                            </label>
                                            {permission.is_system && <Badge variant="secondary" className="text-xs">System</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={isCreating ? handleCreate : handleUpdate}
                                disabled={!formData.name}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isCreating ? 'Create' : 'Update'}
                            </Button>
                            <Button variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Roles List */}
            <div className="space-y-2">
                {roles.map((role: Role) => (
                    <Card key={role.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{role.name}</h3>
                                    {role.is_system && <Badge variant="secondary">System</Badge>}
                                    {role.is_default && (
                                        <Badge variant="default" className="flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Default
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{role.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-500">
                                            Policies ({role.policies.length}):
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {role.policies.slice(0, 3).map((policy: Policy) => (
                                                <Badge key={policy.id} variant="outline" className="text-xs">
                                                    {policy.name}
                                                </Badge>
                                            ))}
                                            {role.policies.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{role.policies.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-500">
                                            Permissions ({role.permissions.length}):
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.slice(0, 3).map((permission: Permission) => (
                                                <Badge key={permission.id} variant="outline" className="text-xs">
                                                    {permission.name}
                                                </Badge>
                                            ))}
                                            {role.permissions.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{role.permissions.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Created: {new Date(role.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEdit(role)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(role.id)}
                                    disabled={role.is_system}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} roles
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}