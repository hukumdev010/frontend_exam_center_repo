'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Save,
    X,
    UserPlus,

    Edit2
} from 'lucide-react';
import { UserWithRoles, Role } from '@/types/rbac';
import UsersService from '../services';

export default function UsersTab() {
    const [users, setUsers] = useState<UserWithRoles[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    const itemsPerPage = 10;

    const fetchUsers = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await UsersService.listUsersWithRoles({
                skip: page * itemsPerPage,
                limit: itemsPerPage,
                search: search || undefined
            });
            setUsers(response.items);
            setTotal(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await UsersService.listRoles({ limit: 1000 });
            setRoles(response.items);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    };

    useEffect(() => {
        const loadUsers = () => {
            fetchUsers(currentPage, searchTerm);
        };
        loadUsers();
        fetchRoles();
    }, [currentPage, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(0);
            fetchUsers(0, searchTerm);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleAssignRoles = async () => {
        if (!editingUser) return;
        try {
            await UsersService.assignUserRoles(editingUser.id, selectedRoles);
            setEditingUser(null);
            setSelectedRoles([]);
            fetchUsers(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign roles');
        }
    };

    const handleRemoveRole = async (userId: string, roleId: number) => {
        if (!confirm('Are you sure you want to remove this role from the user?')) return;
        try {
            await UsersService.removeUserRole(userId, roleId);
            fetchUsers(currentPage, searchTerm);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove role');
        }
    };

    const startEdit = (user: UserWithRoles) => {
        setEditingUser(user);
        setSelectedRoles(user.roles.map(role => role.id));
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setSelectedRoles([]);
    };

    const toggleRole = (roleId: number) => {
        const newSelectedRoles = selectedRoles.includes(roleId)
            ? selectedRoles.filter(id => id !== roleId)
            : [...selectedRoles, roleId];
        setSelectedRoles(newSelectedRoles);
    };

    if (loading) {
        return <div className="text-center py-8">Loading users...</div>;
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Total: {total} users
                </div>
            </div>

            {/* Role Assignment Form */}
            {editingUser && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Manage Roles for {editingUser.name || editingUser.email}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Available Roles</Label>
                            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`role-${role.id}`}
                                                checked={selectedRoles.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="rounded"
                                            />
                                            <label htmlFor={`role-${role.id}`} className="flex-1 text-sm">
                                                {role.name}
                                                {role.description && (
                                                    <span className="text-gray-500 ml-2">- {role.description}</span>
                                                )}
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {role.is_system && <Badge variant="secondary" className="text-xs">System</Badge>}
                                            {role.is_default && <Badge variant="default" className="text-xs">Default</Badge>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAssignRoles}>
                                <Save className="h-4 w-4 mr-2" />
                                Update Roles
                            </Button>
                            <Button variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Users List */}
            <div className="space-y-2">
                {users.map((user) => (
                    <Card key={user.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{user.name || 'Unnamed User'}</h3>
                                    <Badge variant="outline" className="text-xs">{user.email}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">
                                        Roles ({user.roles.length}):
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <div key={role.id} className="flex items-center gap-1">
                                                    <Badge
                                                        variant={role.is_default ? "default" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {role.name}
                                                        {role.is_system && ' (System)'}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0 hover:bg-red-100"
                                                        onClick={() => handleRemoveRole(user.id, role.id)}
                                                        disabled={role.is_system}
                                                        title="Remove role"
                                                    >
                                                        <X className="h-3 w-3 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">No roles assigned</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    User ID: {user.id}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEdit(user)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Manage Roles
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {users.length === 0 && !loading && (
                <Card className="p-8">
                    <div className="text-center text-gray-500">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">No users found</h3>
                        <p>No users match your search criteria.</p>
                    </div>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} users
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