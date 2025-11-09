"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TeacherProfile, TeachingSession } from "./services";
import { useTeacherProfile, useMyTeachingSessions } from "@/hooks/useApi";
import {
    TeacherDashboardHeader,
    TeacherStatsCards,
    RecentSessions,
    TeacherQuickActions,
    LearningTab,
    TeachingSessionsTab,
    QualificationsTab,
    StudentsTab
} from "./components";

export default function TeacherDashboard() {
    const { status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");

    // Use SWR hooks for data fetching
    const { data: teacherProfileData, isLoading: profileLoading, error: profileError } = useTeacherProfile();
    const { data: teachingSessionsData, isLoading: sessionsLoading } = useMyTeachingSessions();

    // Type the data properly
    const teacherProfile = teacherProfileData as TeacherProfile | undefined;
    const teachingSessions = (teachingSessionsData as TeachingSession[]) || [];

    // Calculate overall loading state
    const loading = profileLoading || sessionsLoading;

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);

    // Handle teacher profile errors (404/403 means not a teacher)
    useEffect(() => {
        if (profileError) {
            const errorMessage = profileError.message || String(profileError);
            if (errorMessage.includes('404') || errorMessage.includes('403')) {
                router.push("/dashboard/teacher/apply");
                return;
            }
        }
    }, [profileError, router]);

    const getSessionStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled": return "bg-blue-100 text-blue-800";
            case "completed": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If there was an error fetching profile or profile is null, show apply page
    if (profileError || !teacherProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>No Teacher Profile Found</CardTitle>
                        <CardDescription>
                            You need to apply as a teacher first to access this dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="/dashboard/teacher/apply">
                            <Button>Apply as Teacher</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <TeacherDashboardHeader teacherProfile={teacherProfile} />

                {/* Stats Cards */}
                <TeacherStatsCards
                    teachingSessions={teachingSessions}
                />

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="learning">My Learning</TabsTrigger>
                        <TabsTrigger value="sessions">Teaching</TabsTrigger>
                        <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <RecentSessions
                            teachingSessions={teachingSessions}
                            getSessionStatusColor={getSessionStatusColor}
                        />
                        <TeacherQuickActions />
                    </TabsContent>

                    <TabsContent value="learning" className="space-y-6">
                        <LearningTab />
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-6">
                        <TeachingSessionsTab
                            teachingSessions={teachingSessions}
                            getSessionStatusColor={getSessionStatusColor}
                        />
                    </TabsContent>

                    <TabsContent value="qualifications" className="space-y-6">
                        <QualificationsTab teacherProfile={teacherProfile} />
                    </TabsContent>

                    <TabsContent value="students" className="space-y-6">
                        <StudentsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}