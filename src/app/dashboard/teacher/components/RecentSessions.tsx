import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, Users } from "lucide-react";
import Link from "next/link";
import { TeachingSession } from "../services";

interface RecentSessionsProps {
    teachingSessions: TeachingSession[];
    getSessionStatusColor: (status: string) => string;
}

export function RecentSessions({ teachingSessions, getSessionStatusColor }: RecentSessionsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Sessions</CardTitle>
                    <CardDescription>Your latest teaching sessions</CardDescription>
                </div>
                <Link href="/dashboard/teacher/sessions/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Session
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {teachingSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">No teaching sessions yet</p>
                        <Link href="/dashboard/teacher/sessions/create">
                            <Button>Create Your First Session</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teachingSessions.slice(0, 3).map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium">{session.title}</h3>
                                        <Badge className={getSessionStatusColor(session.status)}>
                                            {session.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(session.scheduled_for).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {session.duration_hours}h
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {session.bookings_count}/{session.max_participants}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${session.session_fee}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}