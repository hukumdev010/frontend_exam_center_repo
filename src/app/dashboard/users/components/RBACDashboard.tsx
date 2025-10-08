'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Key, Settings } from 'lucide-react';
import PoliciesTab from './PoliciesTab';
import PermissionsTab from './PermissionsTab';
import RolesTab from './RolesTab';
import UsersTab from './UsersTab';

export default function RBACDashboard() {
    const [activeTab, setActiveTab] = useState('policies');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User & Access Management</h1>
                    <p className="text-muted-foreground">
                        Manage roles, permissions, policies, and user access control
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="policies" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Policies
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Permissions
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Roles
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="policies" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Policy Management
                            </CardTitle>
                            <CardDescription>
                                Manage access policies that define specific permissions for resources and actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PoliciesTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Permission Management
                            </CardTitle>
                            <CardDescription>
                                Create and manage permissions by grouping related policies together.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PermissionsTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Role Management
                            </CardTitle>
                            <CardDescription>
                                Define roles by combining policies and permissions for different user types.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RolesTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                User Role Assignment
                            </CardTitle>
                            <CardDescription>
                                View users and manage their role assignments to control access levels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UsersTab />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}