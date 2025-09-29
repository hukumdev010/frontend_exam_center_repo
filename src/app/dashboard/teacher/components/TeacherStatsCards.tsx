import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Award, Star } from "lucide-react";
import { TeacherProfile, TeachingSession } from "../services";

interface TeacherStatsCardsProps {
    teacherProfile: TeacherProfile;
    teachingSessions: TeachingSession[];
}

export function TeacherStatsCards({ teacherProfile, teachingSessions }: TeacherStatsCardsProps) {
    const totalBookings = teachingSessions.reduce((sum, session) => sum + session.bookings_count, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Teaching Sessions</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{teachingSessions.length}</div>
                    <p className="text-xs text-muted-foreground">Total sessions created</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Students Helped</CardTitle>
                    <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                    <p className="text-xs text-muted-foreground">Total bookings</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Qualifications</CardTitle>
                    <Award className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{teacherProfile.qualifications.length}</div>
                    <p className="text-xs text-muted-foreground">Subjects you can teach</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                    <Star className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${teacherProfile.hourly_rate}</div>
                    <p className="text-xs text-muted-foreground">Per hour</p>
                </CardContent>
            </Card>
        </div>
    );
}