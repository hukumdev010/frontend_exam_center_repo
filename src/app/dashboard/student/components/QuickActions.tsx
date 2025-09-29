import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, Users } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/dashboard/categories">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Browse Certifications
                        </CardTitle>
                        <CardDescription>Explore available certification exams</CardDescription>
                    </CardHeader>
                </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/quiz">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-green-500" />
                            Take a Quiz
                        </CardTitle>
                        <CardDescription>Start practicing for your certifications</CardDescription>
                    </CardHeader>
                </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/sessions">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-orange-500" />
                            Find a Teacher
                        </CardTitle>
                        <CardDescription>Book sessions with qualified instructors</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
        </div>
    );
}