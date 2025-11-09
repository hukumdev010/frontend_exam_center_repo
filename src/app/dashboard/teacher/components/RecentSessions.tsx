import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeachingSession } from "../services";

export function RecentSessions({
    teachingSessions,
    getSessionStatusColor
}: {
    teachingSessions: TeachingSession[];
    getSessionStatusColor: (status: string) => string;
}) {
    const recentSessions = teachingSessions.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Teaching Sessions</CardTitle>
                <CardDescription>Your latest teaching activities</CardDescription>
            </CardHeader>
            <CardContent>
                {recentSessions.length === 0 ? (
                    <p className="text-gray-500">No recent sessions found.</p>
                ) : (
                    <div className="space-y-4">
                        {recentSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{session.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Student: {session.student?.username || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(session.scheduled_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge className={getSessionStatusColor(session.status)}>
                                    {session.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}