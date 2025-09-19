"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Award,
    BookOpen,
    Users,
    Calendar,
    BarChart3,
    GraduationCap,
    Clock,
    ChevronRight,
    Settings
} from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";

type UserRole = "student" | "teacher" | "admin";

interface DashboardStats {
    totalQuizzes: number;
    completedQuizzes: number;
    avgScore: number;
    totalCertifications: number;
    teachingSessions?: number;
    studentsHelped?: number;
}

export default function DashboardPage() {
    const { data: session, status, getAuthHeaders } = useSession();
    const router = useRouter();
    const [userRole, setUserRole] = useState<UserRole>("student");
    const [stats, setStats] = useState<DashboardStats>({
        totalQuizzes: 0,
        completedQuizzes: 0,
        avgScore: 0,
        totalCertifications: 0,
    });
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            checkUserRole();
            loadDashboardStats();
        }
    }, [session?.user?.id]);

    const checkUserRole = async () => {
        try {
            // Check if user is a teacher
            const teacherResponse = await fetch(`${API_ENDPOINTS.base}/api/teachers/me`, {
                headers: getAuthHeaders(),
            });

            if (teacherResponse.ok) {
                const teacherData = await teacherResponse.json();
                setTeacherProfile(teacherData);
                setUserRole("teacher");
            } else {
                setUserRole("student");
            }
        } catch (error) {
            console.error("Error checking user role:", error);
            setUserRole("student");
        }
    };

    const loadDashboardStats = async () => {
        try {
            setIsLoadingStats(true);

            // Load progress stats (for students)
            const progressResponse = await fetch(`${API_ENDPOINTS.base}/api/progress`, {
                headers: getAuthHeaders(),
            });

            if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                const totalCertifications = progressData.length;
                const completedQuizzes = progressData.filter((p: any) => p.score > 0).length;
                const avgScore = progressData.length > 0
                    ? progressData.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / progressData.length
                    : 0;

                setStats(prev => ({
                    ...prev,
                    totalCertifications,
                    completedQuizzes,
                    avgScore: Math.round(avgScore),
                }));
            }

            // If teacher, load teaching sessions
            if (userRole === "teacher") {
                const sessionsResponse = await fetch(`${API_ENDPOINTS.base}/api/sessions/my/teaching`, {
                    headers: getAuthHeaders(),
                });

                if (sessionsResponse.ok) {
                    const sessionsData = await sessionsResponse.json();
                    setStats(prev => ({
                        ...prev,
                        teachingSessions: sessionsData.length,
                    }));
                }
            }

            // Load recent activity
            try {
                const activityResponse = await fetch(`${API_ENDPOINTS.base}/api/quiz-attempts/recent`, {
                    headers: getAuthHeaders(),
                });

                if (activityResponse.ok) {
                    const activityData = await activityResponse.json();
                    setRecentActivity(activityData);
                }
            } catch (error) {
                console.error("Error loading recent activity:", error);
            }

        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {session?.user?.name || session?.user?.email}!
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {userRole === "teacher" ? "Manage your teaching sessions and help students learn" : "Continue your certification journey"}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={userRole === "teacher" ? "default" : "secondary"} className="px-3 py-1">
                                <GraduationCap className="w-4 h-4 mr-1" />
                                {userRole === "teacher" ? "Teacher" : "Student"}
                            </Badge>
                            <Link href="/profile">
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                            <Award className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCertifications}</div>
                            <p className="text-xs text-muted-foreground">Available to practice</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
                            <BookOpen className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
                            <p className="text-xs text-muted-foreground">Quizzes completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <BarChart3 className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avgScore}%</div>
                            <p className="text-xs text-muted-foreground">Across all quizzes</p>
                        </CardContent>
                    </Card>

                    {userRole === "teacher" ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Teaching Sessions</CardTitle>
                                <Users className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.teachingSessions || 0}</div>
                                <p className="text-xs text-muted-foreground">Sessions created</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                                <Clock className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">--h</div>
                                <p className="text-xs text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {userRole === "teacher" ? (
                        <>
                            {/* Teacher Actions */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        Teacher Dashboard
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your teaching sessions, students, and course materials
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Link href="/dashboard/teacher" className="block">
                                            <Button className="w-full justify-between" variant="outline">
                                                Access Teacher Dashboard
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/dashboard/teacher/sessions">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Sessions
                                                </Button>
                                            </Link>
                                            <Link href="/dashboard/teacher/profile">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-green-500" />
                                        Continue Learning
                                    </CardTitle>
                                    <CardDescription>
                                        Keep improving your skills and qualifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Link href="/dashboard/student" className="block">
                                            <Button className="w-full justify-between" variant="outline">
                                                Student Mode
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/quiz">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <Award className="w-4 h-4 mr-2" />
                                                    Practice
                                                </Button>
                                            </Link>
                                            <Link href="/category">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Browse
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            {/* Student Actions */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                        Student Dashboard
                                    </CardTitle>
                                    <CardDescription>
                                        Take quizzes, track progress, and earn certifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Link href="/dashboard/student" className="block">
                                            <Button className="w-full justify-between" variant="outline">
                                                Access Student Dashboard
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/quiz">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <Award className="w-4 h-4 mr-2" />
                                                    Take Quiz
                                                </Button>
                                            </Link>
                                            <Link href="/category">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Browse
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-green-500" />
                                        Become a Teacher
                                    </CardTitle>
                                    <CardDescription>
                                        Qualify to teach by scoring 90%+ on certification exams
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Link href="/dashboard/teacher/apply" className="block">
                                            <Button className="w-full justify-between" variant="outline">
                                                Apply to Teach
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/sessions">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Sessions
                                                </Button>
                                            </Link>
                                            <Link href="/dashboard/teacher/eligibility">
                                                <Button variant="ghost" size="sm" className="w-full">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Eligibility
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest achievements and progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingStats ? (
                                <div className="flex items-center space-x-4">
                                    <div className="animate-pulse rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
                                        <div className="animate-pulse bg-gray-200 h-3 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ) : recentActivity.length > 0 ? (
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                                            <div className="flex-shrink-0">
                                                {activity.score >= 80 ? (
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Award className="w-5 h-5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-gray-900">
                                                        {activity.certification_name}
                                                    </p>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${activity.score >= 80
                                                        ? 'bg-green-100 text-green-800'
                                                        : activity.score >= 60
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {activity.score}%
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Completed {new Date(activity.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>No recent activity yet. Start taking quizzes to see your progress here!</p>
                                    <Link href="/category">
                                        <Button className="mt-4">
                                            Browse Certifications
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}