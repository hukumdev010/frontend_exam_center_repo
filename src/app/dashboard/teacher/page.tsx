"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Users,
    Award,
    Plus,
    Clock,
    MapPin,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle,
    Settings,
    ArrowLeft,
    BookOpen,
    GraduationCap
} from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";

interface TeacherProfile {
    id: number;
    user_id: string;
    bio: string;
    status: string;
    is_available: boolean;
    hourly_rate: number;
    qualifications: TeacherQualification[];
}

interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

interface TeachingSession {
    id: number;
    title: string;
    description: string;
    session_type: string;
    scheduled_for: string;
    duration_hours: number;
    max_participants: number;
    session_fee: number;
    location_type: string;
    location_details: string;
    status: string;
    bookings_count: number;
}

export default function TeacherDashboard() {
    const { data: session, status, getToken, getAuthHeaders } = useSession();
    const router = useRouter();
    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
    const [teachingSessions, setTeachingSessions] = useState<TeachingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const loadTeacherData = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();

            if (!token) {
                router.push("/auth");
                return;
            }

            // Load teacher profile
            const profileResponse = await fetch(`${API_ENDPOINTS.base}/api/teachers/me`, {
                headers: getAuthHeaders(),
            });

            if (!profileResponse.ok) {
                router.push("/dashboard/teacher/apply");
                return;
            }

            const profileData = await profileResponse.json();
            setTeacherProfile(profileData);

            // Load teaching sessions
            const sessionsResponse = await fetch(`${API_ENDPOINTS.base}/api/sessions/my/teaching`, {
                headers: getAuthHeaders(),
            });

            if (sessionsResponse.ok) {
                const sessionsData = await sessionsResponse.json();
                setTeachingSessions(sessionsData);
            }
        } catch (error) {
            console.error("Error loading teacher data:", error);
        } finally {
            setLoading(false);
        }
    }, [router, getToken, getAuthHeaders]);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        } else if (status === 'authenticated' && session) {
            loadTeacherData();
        }
    }, [session, status, router, loadTeacherData]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getSessionStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled": return "bg-blue-100 text-blue-800";
            case "completed": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!teacherProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>No Teacher Profile Found</CardTitle>
                        <CardDescription>
                            You need to apply as a teacher first to access this dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="/dashboard/teacher/apply">
                            <Button>Apply as Teacher</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Teaching Dashboard</h1>
                                <p className="text-gray-600 mt-2">Your teaching features - continue learning while helping others</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        Student Features Active
                                    </Badge>
                                    <Badge variant="default" className="text-xs">
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        Teaching Enabled
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {getStatusBadge(teacherProfile.status)}
                            <Link href="/dashboard/teacher/profile">
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Profile Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
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
                            <div className="text-2xl font-bold">
                                {teachingSessions.reduce((sum, session) => sum + session.bookings_count, 0)}
                            </div>
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

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="learning">My Learning</TabsTrigger>
                        <TabsTrigger value="sessions">Teaching</TabsTrigger>
                        <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Recent Sessions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Sessions</CardTitle>
                                    <CardDescription>Your latest teaching sessions</CardDescription>
                                </div>
                                <Link href="/dashboard/teacher/sessions/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Session
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {teachingSessions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500 mb-4">No teaching sessions yet</p>
                                        <Link href="/dashboard/teacher/sessions/create">
                                            <Button>Create Your First Session</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {teachingSessions.slice(0, 3).map((session) => (
                                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-medium">{session.title}</h3>
                                                        <Badge className={getSessionStatusColor(session.status)}>
                                                            {session.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(session.scheduled_for).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {session.duration_hours}h
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {session.bookings_count}/{session.max_participants}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${session.session_fee}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
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
                    </TabsContent>

                    <TabsContent value="learning" className="space-y-6">
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
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-6">
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
                    </TabsContent>

                    <TabsContent value="qualifications" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">Your Qualifications</h2>
                            <p className="text-gray-600">Subjects you&apos;re qualified to teach (90%+ score required)</p>
                        </div>

                        {teacherProfile.qualifications.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-medium mb-2">No qualifications yet</h3>
                                    <p className="text-gray-600 mb-6">Take certification exams and score 90%+ to qualify as a teacher</p>
                                    <Link href="/quiz">
                                        <Button>Take Certification Exams</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {teacherProfile.qualifications.map((qual) => (
                                    <Card key={qual.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium">{qual.certification_name}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{qual.category_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Qualified on {new Date(qual.qualified_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="w-5 h-5 text-yellow-500" />
                                                        <span className="text-lg font-bold text-green-600">{qual.score}%</span>
                                                    </div>
                                                    <Badge variant="secondary">Qualified</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="students" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">Student Management</h2>
                            <p className="text-gray-600">View and manage your student interactions</p>
                        </div>

                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-medium mb-2">Student management coming soon</h3>
                                <p className="text-gray-600 mb-6">Advanced student tracking and communication features will be available here</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}