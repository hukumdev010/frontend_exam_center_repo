"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProgress, SessionBooking, AvailableSession } from "./services";
import { useUserProgress, useMyBookings, useAvailableSessions } from "@/hooks/useApi";
import {
    DashboardHeader,
    StatsCards,
    ContinueLearning,
    AvailableSessions,
    QuickActions,
    ProgressTab,
    SessionsTab,
    BookingsTab
} from "./components";

export default function StudentDashboard() {
    const { status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");

    // Use SWR hooks for data fetching
    const { data: progressData, isLoading: progressLoading } = useUserProgress();
    const { data: bookingsData, isLoading: bookingsLoading } = useMyBookings();
    const { data: availableSessionsData, isLoading: availableSessionsLoading } = useAvailableSessions();

    // Type the data properly
    const progress = (progressData as UserProgress[]) || [];
    const bookings = (bookingsData as SessionBooking[]) || [];
    const availableSessions = (availableSessionsData as AvailableSession[]) || [];

    // Calculate overall loading state
    const loading = progressLoading || bookingsLoading || availableSessionsLoading;

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);



    const getProgressStats = () => {
        const totalCertifications = progress.length;
        const completedCertifications = progress.filter(p => p.passed).length;
        const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
        const avgScore = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
            : 0;

        return { totalCertifications, completedCertifications, totalAttempts, avgScore };
    };

    const getBookingStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "cancelled": return "bg-red-100 text-red-800";
            case "completed": return "bg-blue-100 text-blue-800";
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

    const stats = getProgressStats();

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <DashboardHeader />

                {/* Stats Cards */}
                <StatsCards stats={stats} />

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Continue Learning */}
                        <ContinueLearning progress={progress} />

                        {/* Available Sessions */}
                        <AvailableSessions availableSessions={availableSessions} />

                        {/* Quick Actions */}
                        <QuickActions />
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-6">
                        <ProgressTab progress={progress} />
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-6">
                        <SessionsTab availableSessions={availableSessions} />
                    </TabsContent>

                    <TabsContent value="bookings" className="space-y-6">
                        <BookingsTab bookings={bookings} getBookingStatusColor={getBookingStatusColor} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}