import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Award, Users } from "lucide-react";
import Link from "next/link";

export function LearningTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">My Learning Journey</h2>
                <p className="text-gray-600">Continue your own education while teaching others</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/student">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                Student Dashboard
                            </CardTitle>
                            <CardDescription>View your complete learning progress and achievements</CardDescription>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/quiz">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-500" />
                                Take Quizzes
                            </CardTitle>
                            <CardDescription>Continue practicing and earning new certifications</CardDescription>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/sessions">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-500" />
                                Find Teachers
                            </CardTitle>
                            <CardDescription>Book sessions to learn from other qualified teachers</CardDescription>
                        </CardHeader>
                    </Link>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Learning Reminder</CardTitle>
                    <CardDescription>As a teacher, staying current with your knowledge helps you teach better</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-900 mb-1">Keep Learning</h4>
                                <p className="text-sm text-blue-700">
                                    The best teachers are lifelong learners. Continue taking quizzes and earning certifications
                                    to expand what you can teach and stay sharp in your existing subjects.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}