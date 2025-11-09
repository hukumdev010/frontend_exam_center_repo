"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Define TeachingSession interface locally
interface TeachingSession {
    id: number;
    title: string;
    description: string;
    session_type: string;
    scheduled_for: string;
    duration_hours: number;
    max_participants: number;
    session_fee: number;
    location_type: string;
    location_details: string;
    status: string;
    bookings_count: number;
}
import { useMyTeachingSessions } from "@/hooks/useApi";
import { Calendar, Users, Clock, Plus, DollarSign } from "lucide-react";

export default function TeachingSessionsPage() {
    // Use SWR hook for data fetching
    const { data: sessionData, isLoading: loading } = useMyTeachingSessions();
    const sessions = (sessionData as TeachingSession[]) || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Teaching Sessions</h1>
                    <p className="text-muted-foreground">Manage your upcoming and past teaching sessions</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Session
                </Button>
            </div>

            {/* Sessions Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessions.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {sessions.filter((s: TeachingSession) => s.status === 'scheduled').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {sessions.reduce((sum: number, s: TeachingSession) => sum + (s.bookings_count || 0), 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${sessions.reduce((sum: number, s: TeachingSession) => sum + ((s.session_fee || 0) * (s.bookings_count || 0)), 0).toFixed(0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sessions List */}
            {sessions.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>My Teaching Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sessions.map((session: TeachingSession) => (
                                <div key={session.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <h3 className="font-medium">{session.title}</h3>
                                            <p className="text-sm text-muted-foreground">{session.description}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(session.scheduled_for).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {session.duration_hours}h
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {session.bookings_count}/{session.max_participants}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    ${session.session_fee}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <Badge className={getStatusColor(session.status)}>
                                                {session.status.replace('_', ' ')}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Teaching Sessions Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Create your first teaching session to start sharing your knowledge with students.
                        </p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Session
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}