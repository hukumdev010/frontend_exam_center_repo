"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
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
    Trophy,

    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { DashboardService } from "./services";
import { StudentService, UserProgress as StudentProgress } from "./student/services";
import { TeacherService } from "./teacher/services";

interface DashboardStats {
    totalQuizzes: number;
    completedQuizzes: number;
    avgScore: number;
    totalCertifications: number;
    teachingSessions?: number;
    studentsHelped?: number;
}

interface ProgressItem {
    score: number;
    // Add more properties as needed
}

interface ActivityItem {
    score: number;
    certification_name: string;
    created_at: string;
}



export default function DashboardPage() {
    const { data: session, status, getAuthHeaders } = useSession();
    const router = useRouter();
    const [isTeacher, setIsTeacher] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        totalQuizzes: 0,
        completedQuizzes: 0,
        avgScore: 0,
        totalCertifications: 0,
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [progress, setProgress] = useState<StudentProgress[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(true);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            checkTeacherRole();
            loadDashboardStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    const checkTeacherRole = async () => {
        try {
            await TeacherService.getMyProfile(getAuthHeaders());
            setIsTeacher(true);
        } catch {
            setIsTeacher(false);
        }
    };

    const loadDashboardStats = async () => {
        try {
            setIsLoadingStats(true);
            setLoadingProgress(true);

            // Load progress stats (for students)
            try {
                const progressData = await StudentService.getProgress(getAuthHeaders());
                const totalCertifications = progressData.length;
                const completedQuizzes = progressData.filter((p: ProgressItem) => p.score > 0).length;
                const avgScore = progressData.length > 0
                    ? progressData.reduce((sum: number, p: ProgressItem) => sum + (p.score || 0), 0) / progressData.length
                    : 0;

                setStats(prev => ({
                    ...prev,
                    totalCertifications,
                    completedQuizzes,
                    avgScore: Math.round(avgScore),
                }));

                // Set the detailed progress data for the new sections
                setProgress(progressData);
            } catch (error) {
                console.error("Error loading progress:", error);
            }

            // If teacher, load teaching sessions
            if (isTeacher) {
                try {
                    const sessionsData = await TeacherService.getMyTeachingSessions(getAuthHeaders());
                    setStats(prev => ({
                        ...prev,
                        teachingSessions: sessionsData.length,
                    }));
                } catch (error) {
                    console.error("Error loading teaching sessions:", error);
                }
            }

            // Load recent activity
            try {
                const activityData = await DashboardService.getUserActivity(getAuthHeaders(), 10);
                setRecentActivity(activityData);
            } catch (error) {
                console.error("Error loading recent activity:", error);
            }

        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        } finally {
            setIsLoadingStats(false);
            setLoadingProgress(false);
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
        <div className="p-4 lg:p-6">
            {/* Stats Cards - Student stats always shown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                        <Award className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCertifications}</div>
                        <p className="text-xs text-muted-foreground">Available to practice</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
                        <p className="text-xs text-muted-foreground">Quizzes completed</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgScore}%</div>
                        <p className="text-xs text-muted-foreground">Across all quizzes</p>
                    </CardContent>
                </Card>

                {isTeacher ? (
                    <Card className="hover:shadow-md transition-shadow">
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
                    <Card className="hover:shadow-md transition-shadow">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Student Dashboard - Always shown as primary */}
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
                                    Access Learning Portal
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
                                <Link href="/dashboard/categories">
                                    <Button variant="ghost" size="sm" className="w-full">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Browse
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Teacher Features - Show only if user is qualified/eligible */}
                {isTeacher ? (
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-500" />
                                Teaching Features
                            </CardTitle>
                            <CardDescription>
                                Manage your teaching sessions and help other students
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/dashboard/teacher" className="block">
                                    <Button className="w-full justify-between" variant="outline">
                                        Teacher Dashboard
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/dashboard/teacher/sessions">
                                        <Button variant="ghost" size="sm" className="w-full">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            My Sessions
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
                ) : (
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
                                            Find Sessions
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
                )}
            </div>

            {/* Recent Activity */}
            <Card className="hover:shadow-lg transition-shadow mb-6">
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
                                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                                <Link href="/dashboard/categories">
                                    <Button className="mt-4">
                                        Browse Certifications
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Progress Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attempts */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Recent Practice
                        </CardTitle>
                        <CardDescription>Your recent quiz attempts and progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingProgress ? (
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : progress.filter(p => p.attempts > 0).length > 0 ? (
                            <div className="space-y-4">
                                {progress.filter(p => p.attempts > 0).slice(0, 5).map((item) => (
                                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.certification_name}</h3>
                                                <p className="text-sm text-gray-600">{item.category_name}</p>
                                            </div>
                                            <span className="text-sm font-medium text-blue-600">
                                                {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                Latest Score: {item.score}%
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${item.passed
                                                ? 'bg-green-100 text-green-800'
                                                : item.score >= 70
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.passed ? 'Passed' : 'Practice'}
                                            </span>
                                        </div>
                                        <Progress
                                            value={item.score}
                                            className="mt-2 h-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No attempts yet</p>
                                <Link href="/quiz">
                                    <Button className="mt-3">Start a Quiz</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Passed Certifications */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            Achievements
                        </CardTitle>
                        <CardDescription>Certifications you&apos;ve passed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingProgress ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : progress.filter(p => p.passed).length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {progress.filter(p => p.passed).map((item) => (
                                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.certification_name}</h3>
                                                <p className="text-sm text-gray-600">{item.category_name}</p>
                                            </div>
                                            <div className="text-green-600">
                                                <Trophy className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Best Score: {item.score}%</span>
                                            <span>{item.attempts} attempt{item.attempts !== 1 ? 's' : ''}</span>
                                        </div>
                                        <Progress
                                            value={item.score}
                                            className="h-2"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Last attempted: {new Date(item.last_attempted).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No certifications passed yet</p>
                                <p className="text-sm text-gray-500 mt-1">Pass with 80% or higher to earn certification</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}