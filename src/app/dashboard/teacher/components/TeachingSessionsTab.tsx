import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TeachingSession } from "../services";

export function TeachingSessionsTab({
    teachingSessions,
    getSessionStatusColor
}: {
    teachingSessions: TeachingSession[];
    getSessionStatusColor: (status: string) => string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Teaching Sessions</CardTitle>
                    <CardDescription>Manage your teaching schedule</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/dashboard/teacher/sessions/create">
                        <Plus className="h-4 w-4 mr-2" />
                        New Session
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {teachingSessions.length === 0 ? (
                    <p className="text-gray-500">No teaching sessions scheduled.</p>
                ) : (
                    <div className="space-y-4">
                        {teachingSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{session.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Student: {session.student?.username || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(session.scheduled_date).toLocaleDateString()} - {session.duration_minutes} minutes
                                    </p>
                                    {session.description && (
                                        <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <Badge className={getSessionStatusColor(session.status)}>
                                        {session.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}