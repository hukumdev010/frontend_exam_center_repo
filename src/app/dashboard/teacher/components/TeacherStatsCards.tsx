import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Award } from "lucide-react";
import { TeachingSession } from "../services";

export function TeacherStatsCards({
    teachingSessions
}: {
    teachingSessions: TeachingSession[]
}) {
    const totalSessions = teachingSessions.length;
    const completedSessions = teachingSessions.filter(s => s.status === 'completed').length;
    const upcomingSessions = teachingSessions.filter(s => s.status === 'scheduled').length;
    const uniqueStudents = new Set(teachingSessions.map(s => s.student_id)).size;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <Award className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedSessions}</div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                    <Clock className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingSessions}</div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Students</CardTitle>
                    <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueStudents}</div>
                </CardContent>
            </Card>
        </div>
    );
}