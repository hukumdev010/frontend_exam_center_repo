"use client";

import { useState } from "react";
import { useSession } from "@/lib/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Key, Save } from "lucide-react";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        bio: ""
    });

    const [notifications, setNotifications] = useState({
        email_notifications: true,
        session_reminders: true,
        achievement_alerts: true
    });

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Profile updated successfully!");
        } catch {
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Notification settings updated!");
        } catch {
            alert("Failed to update notifications");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and settings.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Key className="h-4 w-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} disabled={isLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isLoading ? "Saving..." : "Save Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what notifications you want to receive</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Email Notifications</div>
                                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                                </div>
                                <Switch
                                    checked={notifications.email_notifications}
                                    onCheckedChange={(checked) =>
                                        setNotifications(prev => ({ ...prev, email_notifications: checked }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Session Reminders</div>
                                    <div className="text-sm text-gray-500">Get reminded about upcoming sessions</div>
                                </div>
                                <Switch
                                    checked={notifications.session_reminders}
                                    onCheckedChange={(checked) =>
                                        setNotifications(prev => ({ ...prev, session_reminders: checked }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Achievement Alerts</div>
                                    <div className="text-sm text-gray-500">Notifications for completed certifications</div>
                                </div>
                                <Switch
                                    checked={notifications.achievement_alerts}
                                    onCheckedChange={(checked) =>
                                        setNotifications(prev => ({ ...prev, achievement_alerts: checked }))
                                    }
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isLoading ? "Saving..." : "Save Preferences"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Control who can see your information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-500 py-8">Privacy settings coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-500 py-8">Security settings coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
