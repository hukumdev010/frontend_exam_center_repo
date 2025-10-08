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
    X
} from 'lucide-react';
import { Permission, PermissionCreate, Policy } from '@/types/rbac';
import UsersService from '../services';

export default function PermissionsTab() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [formData, setFormData] = useState<PermissionCreate>({
        name: '',
        description: '',
        policy_ids: []
    });

    const itemsPerPage = 10;

    const fetchPermissions = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await UsersService.listPermissions({
                skip: page * itemsPerPage,
                limit: itemsPerPage,
                search: search || undefined
            });
            setPermissions(response.items);
            setTotal(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchPolicies = async () => {
        try {
            const response = await UsersService.listPolicies({ limit: 1000 });
            setPolicies(response.items);
        } catch (err) {
            console.error('Failed to fetch policies:', err);
        }
    };

    useEffect(() => {
        const loadPermissions = () => {
            fetchPermissions(currentPage, searchTerm);
        };
        loadPermissions();
        fetchPolicies();
    }, [currentPage, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(0);
            fetchPermissions(0, searchTerm);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleCreate = async () => {
        try {
            await UsersService.createPermission(formData);
            setIsCreating(false);
            setFormData({ name: '', description: '', policy_ids: [] });
            fetchPermissions(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create permission');
        }
    };

    const handleUpdate = async () => {
        if (!editingPermission) return;
        try {
            await UsersService.updatePermission(editingPermission.id, {
                description: formData.description,
                policy_ids: formData.policy_ids
            });
            setEditingPermission(null);
            setFormData({ name: '', description: '', policy_ids: [] });
            fetchPermissions(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update permission');
        }
    };

    const handleDelete = async (permissionId: number) => {
        if (!confirm('Are you sure you want to delete this permission?')) return;
        try {
            await UsersService.deletePermission(permissionId);
            fetchPermissions(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete permission');
        }
    };

    const startEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,
            description: permission.description || '',
            policy_ids: permission.policies.map(p => p.id)
        });
    };

    const cancelEdit = () => {
        setEditingPermission(null);
        setIsCreating(false);
        setFormData({ name: '', description: '', policy_ids: [] });
    };

    const togglePolicy = (policyId: number) => {
        const newPolicyIds = formData.policy_ids?.includes(policyId)
            ? formData.policy_ids.filter(id => id !== policyId)
            : [...(formData.policy_ids || []), policyId];
        setFormData({ ...formData, policy_ids: newPolicyIds });
    };

    if (loading) {
        return <div className="text-center py-8">Loading permissions...</div>;
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
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Permission
                </Button>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingPermission) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{isCreating ? 'Create Permission' : 'Edit Permission'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!!editingPermission}
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
                        <div>
                            <Label>Policies</Label>
                            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                {policies.map((policy) => (
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

            {/* Permissions List */}
            <div className="space-y-2">
                {permissions.map((permission) => (
                    <Card key={permission.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{permission.name}</h3>
                                    {permission.is_system && <Badge variant="secondary">System</Badge>}
                                </div>
                                <p className="text-sm text-gray-600">{permission.description}</p>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">
                                        Policies ({permission.policies.length}):
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {permission.policies.map((policy) => (
                                            <Badge key={policy.id} variant="outline" className="text-xs">
                                                {policy.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Created: {new Date(permission.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEdit(permission)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(permission.id)}
                                    disabled={permission.is_system}
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
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} permissions
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