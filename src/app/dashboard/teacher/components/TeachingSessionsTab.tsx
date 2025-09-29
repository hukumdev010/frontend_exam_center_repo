import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { TeachingSession } from "../services";

interface TeachingSessionsTabProps {
    teachingSessions: TeachingSession[];
    getSessionStatusColor: (status: string) => string;
}

export function TeachingSessionsTab({ teachingSessions, getSessionStatusColor }: TeachingSessionsTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Teaching Sessions</h2>
                    <p className="text-gray-600">Manage all your teaching sessions</p>
                </div>
                <Link href="/dashboard/teacher/sessions/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Session
                    </Button>
                </Link>
            </div>

            {teachingSessions.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No sessions yet</h3>
                        <p className="text-gray-600 mb-6">Create your first teaching session to start helping students</p>
                        <Link href="/dashboard/teacher/sessions/create">
                            <Button>Create Your First Session</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {teachingSessions.map((session) => (
                        <Card key={session.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {session.title}
                                            <Badge className={getSessionStatusColor(session.status)}>
                                                {session.status}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-2">{session.description}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${session.session_fee}</p>
                                        <p className="text-sm text-gray-600">per session</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(session.scheduled_for).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{session.duration_hours} hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>{session.bookings_count}/{session.max_participants} students</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{session.location_type}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="outline" size="sm">View Bookings</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}