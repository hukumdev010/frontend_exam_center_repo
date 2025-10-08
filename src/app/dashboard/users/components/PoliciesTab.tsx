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
import { Policy, PolicyCreate } from '@/types/rbac';
import UsersService from '../services';

export default function PoliciesTab() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
    const [formData, setFormData] = useState<PolicyCreate>({
        name: '',
        description: '',
        resource: '',
        action: ''
    });

    const itemsPerPage = 10;

    const fetchPolicies = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await UsersService.listPolicies({
                skip: page * itemsPerPage,
                limit: itemsPerPage,
                search: search || undefined
            });
            setPolicies(response.items);
            setTotal(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch policies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadPolicies = () => {
            fetchPolicies(currentPage, searchTerm);
        };
        loadPolicies();
    }, [currentPage, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(0);
            fetchPolicies(0, searchTerm);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleCreate = async () => {
        try {
            await UsersService.createPolicy(formData);
            setIsCreating(false);
            setFormData({ name: '', description: '', resource: '', action: '' });
            fetchPolicies(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create policy');
        }
    };

    const handleUpdate = async () => {
        if (!editingPolicy) return;
        try {
            await UsersService.updatePolicy(editingPolicy.id, {
                description: formData.description
            });
            setEditingPolicy(null);
            setFormData({ name: '', description: '', resource: '', action: '' });
            fetchPolicies(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update policy');
        }
    };

    const handleDelete = async (policyId: number) => {
        if (!confirm('Are you sure you want to delete this policy?')) return;
        try {
            await UsersService.deletePolicy(policyId);
            fetchPolicies(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete policy');
        }
    };

    const startEdit = (policy: Policy) => {
        setEditingPolicy(policy);
        setFormData({
            name: policy.name,
            description: policy.description || '',
            resource: policy.resource,
            action: policy.action
        });
    };

    const cancelEdit = () => {
        setEditingPolicy(null);
        setIsCreating(false);
        setFormData({ name: '', description: '', resource: '', action: '' });
    };

    if (loading) {
        return <div className="text-center py-8">Loading policies...</div>;
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
                        placeholder="Search policies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                </Button>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingPolicy) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{isCreating ? 'Create Policy' : 'Edit Policy'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!!editingPolicy}
                                />
                            </div>
                            <div>
                                <Label htmlFor="resource">Resource</Label>
                                <Input
                                    id="resource"
                                    value={formData.resource}
                                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                                    disabled={!!editingPolicy}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="action">Action</Label>
                                <Input
                                    id="action"
                                    value={formData.action}
                                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                                    disabled={!!editingPolicy}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={isCreating ? handleCreate : handleUpdate}
                                disabled={!formData.name || !formData.resource || !formData.action}
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

            {/* Policies List */}
            <div className="space-y-2">
                {policies.map((policy) => (
                    <Card key={policy.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{policy.name}</h3>
                                    {policy.is_system && <Badge variant="secondary">System</Badge>}
                                </div>
                                <p className="text-sm text-gray-600">{policy.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Resource: <code className="bg-gray-100 px-1 rounded">{policy.resource}</code></span>
                                    <span>Action: <code className="bg-gray-100 px-1 rounded">{policy.action}</code></span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Created: {new Date(policy.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEdit(policy)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(policy.id)}
                                    disabled={policy.is_system}
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
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} policies
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