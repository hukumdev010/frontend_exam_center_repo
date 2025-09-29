import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Settings, Award } from "lucide-react";
import Link from "next/link";

export function TeacherQuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/dashboard/teacher/sessions/create">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-500" />
                            Create Session
                        </CardTitle>
                        <CardDescription>Schedule a new teaching session</CardDescription>
                    </CardHeader>
                </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/dashboard/student">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Student Portal
                        </CardTitle>
                        <CardDescription>Continue your own learning journey</CardDescription>
                    </CardHeader>
                </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/dashboard/teacher/profile">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-green-500" />
                            Update Profile
                        </CardTitle>
                        <CardDescription>Edit your teaching profile</CardDescription>
                    </CardHeader>
                </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/quiz">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-orange-500" />
                            Continue Learning
                        </CardTitle>
                        <CardDescription>Take quizzes to gain more qualifications</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
        </div>
    );
}