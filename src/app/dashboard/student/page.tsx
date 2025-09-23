"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Award,
    Calendar,
    Clock,
    TrendingUp,
    Target,
    Users,
    Play,
    ArrowLeft,
    Star,
    CheckCircle,
    XCircle,
    User,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";

interface UserProgress {
    id: number;
    certification_id: number;
    certification_name: string;
    category_name: string;
    score: number;
    attempts: number;
    last_attempted: string;
    passed: boolean;
}

interface SessionBooking {
    id: number;
    session_id: number;
    booking_date: string;
    status: string;
    notes: string;
    feedback_rating: number;
    feedback_comment: string;
    session: {
        title: string;
        description: string;
        scheduled_for: string;
        duration_hours: number;
        session_fee: number;
        location_type: string;
        teacher_name: string;
    };
}

interface AvailableSession {
    id: number;
    title: string;
    description: string;
    scheduled_for: string;
    duration_hours: number;
    session_fee: number;
    location_type: string;
    location_details: string;
    max_participants: number;
    bookings_count: number;
    teacher_name: string;
    category_name: string;
}

export default function StudentDashboard() {
    const { data: session, status, getAuthHeaders } = useSession();
    const router = useRouter();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [bookings, setBookings] = useState<SessionBooking[]>([]);
    const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const loadStudentData = useCallback(async () => {
        try {
            setLoading(true);

            // Load progress
            const progressResponse = await fetch(`${API_ENDPOINTS.base}/api/progress`, {
                headers: getAuthHeaders(),
            });

            if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                setProgress(progressData);
            }

            // Load bookings
            const bookingsResponse = await fetch(`${API_ENDPOINTS.base}/api/sessions/my/bookings`, {
                headers: getAuthHeaders(),
            });

            if (bookingsResponse.ok) {
                const bookingsData = await bookingsResponse.json();
                setBookings(bookingsData);
            }

            // Load available sessions
            const sessionsResponse = await fetch(`${API_ENDPOINTS.base}/api/sessions/available?limit=6`, {
                headers: getAuthHeaders(),
            });

            if (sessionsResponse.ok) {
                const sessionsData = await sessionsResponse.json();
                setAvailableSessions(sessionsData);
            }
        } catch (error) {
            console.error("Error loading student data:", error);
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        } else if (status === 'authenticated' && session) {
            loadStudentData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);



    const getProgressStats = () => {
        const totalCertifications = progress.length;
        const completedCertifications = progress.filter(p => p.passed).length;
        const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
        const avgScore = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
            : 0;

        return { totalCertifications, completedCertifications, totalAttempts, avgScore };
    };

    const getBookingStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "cancelled": return "bg-red-100 text-red-800";
            case "completed": return "bg-blue-100 text-blue-800";
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

    const stats = getProgressStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
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
                                <h1 className="text-3xl font-bold text-gray-900">Learning Portal</h1>
                                <p className="text-gray-600 mt-2">Your comprehensive learning dashboard - track progress and continue growing</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-blue-100 text-blue-800">
                                <BookOpen className="w-4 h-4 mr-1" />
                                Learning Mode
                            </Badge>
                            <Link href="/profile">
                                <Button variant="outline" size="sm">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Certifications</CardTitle>
                            <BookOpen className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCertifications}</div>
                            <p className="text-xs text-muted-foreground">Available to practice</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <Award className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedCertifications}</div>
                            <p className="text-xs text-muted-foreground">Certifications passed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avgScore}%</div>
                            <p className="text-xs text-muted-foreground">Across all attempts</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                            <Target className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                            <p className="text-xs text-muted-foreground">Quiz attempts made</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Continue Learning */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Continue Learning</CardTitle>
                                <CardDescription>Pick up where you left off or start something new</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {progress.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500 mb-4">No progress yet. Start your learning journey!</p>
                                        <Link href="/">
                                            <Button>Browse Certifications</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {progress.slice(0, 3).map((prog) => (
                                            <div key={prog.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-medium">{prog.certification_name}</h3>
                                                        {prog.passed ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" />Passed
                                                            </Badge>
                                                        ) : prog.score >= 70 ? (
                                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                                <Target className="w-3 h-3 mr-1" />Close
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-100 text-gray-800">
                                                                <XCircle className="w-3 h-3 mr-1" />Needs Work
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Best Score: {prog.score}%</span>
                                                            <span>Attempts: {prog.attempts}</span>
                                                        </div>
                                                        <Progress value={prog.score} className="h-2" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <Link href={`/quiz/${prog.certification_id}`}>
                                                        <Button size="sm">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            {prog.score > 0 ? "Retry" : "Start"}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Available Sessions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Available Teaching Sessions</CardTitle>
                                    <CardDescription>Get help from qualified teachers</CardDescription>
                                </div>
                                <Link href="/sessions">
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {availableSessions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500">No sessions available right now</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {availableSessions.slice(0, 2).map((ses) => (
                                            <div key={ses.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-medium">{ses.title}</h3>
                                                        <Badge variant="outline">{ses.category_name}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(ses.scheduled_for).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {ses.duration_hours}h
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {ses.location_type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Teacher: {ses.teacher_name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${ses.session_fee}</p>
                                                    <Button size="sm" className="mt-2">Book Session</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
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
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">Your Progress</h2>
                            <p className="text-gray-600">Track your performance across all certifications</p>
                        </div>

                        {progress.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-medium mb-2">No progress yet</h3>
                                    <p className="text-gray-600 mb-6">Start taking quizzes to track your progress</p>
                                    <Link href="/dashboard/categories">
                                        <Button>Browse Certifications</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {progress.map((prog) => (
                                    <Card key={prog.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        {prog.certification_name}
                                                        {prog.passed && (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" />Passed
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <CardDescription>{prog.category_name}</CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-blue-600">{prog.score}%</p>
                                                    <p className="text-sm text-gray-600">Best Score</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Progress</span>
                                                        <span>{prog.score}%</span>
                                                    </div>
                                                    <Progress value={prog.score} className="h-2" />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-600">
                                                        <p>Attempts: {prog.attempts}</p>
                                                        {prog.last_attempted && (
                                                            <p>Last attempt: {new Date(prog.last_attempted).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                    <Link href={`/quiz/${prog.certification_id}`}>
                                                        <Button size="sm">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            {prog.score > 0 ? "Retake Quiz" : "Start Quiz"}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">Available Sessions</h2>
                            <p className="text-gray-600">Find and book sessions with qualified teachers</p>
                        </div>

                        {availableSessions.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-medium mb-2">No sessions available</h3>
                                    <p className="text-gray-600 mb-6">Check back later for new teaching sessions</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {availableSessions.map((ses) => (
                                    <Card key={ses.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{ses.title}</CardTitle>
                                                    <CardDescription className="mt-2">{ses.description}</CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">${ses.session_fee}</p>
                                                    <p className="text-sm text-gray-600">per session</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>{new Date(ses.scheduled_for).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>{ses.duration_hours} hours</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span>{ses.bookings_count}/{ses.max_participants} booked</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>{ses.location_type}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    <p>Teacher: {ses.teacher_name}</p>
                                                    <p>Category: {ses.category_name}</p>
                                                </div>
                                                <Button>Book Session</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="bookings" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">My Bookings</h2>
                            <p className="text-gray-600">View and manage your session bookings</p>
                        </div>

                        {bookings.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-medium mb-2">No bookings yet</h3>
                                    <p className="text-gray-600 mb-6">Book a teaching session to start learning with an expert</p>
                                    <Link href="/sessions">
                                        <Button>Browse Sessions</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {bookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        {booking.session.title}
                                                        <Badge className={getBookingStatusColor(booking.status)}>
                                                            {booking.status}
                                                        </Badge>
                                                    </CardTitle>
                                                    <CardDescription className="mt-2">
                                                        {booking.session.description}
                                                    </CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold">${booking.session.session_fee}</p>
                                                    <p className="text-sm text-gray-600">session fee</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>{new Date(booking.session.scheduled_for).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>{booking.session.duration_hours} hours</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>{booking.session.location_type}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    <p>Teacher: {booking.session.teacher_name}</p>
                                                    <p>Booked: {new Date(booking.booking_date).toLocaleDateString()}</p>
                                                    {booking.feedback_rating && (
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            <span>Rated {booking.feedback_rating}/5</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {booking.status === "confirmed" && (
                                                        <Button variant="outline" size="sm">Cancel</Button>
                                                    )}
                                                    {booking.status === "completed" && !booking.feedback_rating && (
                                                        <Button size="sm">Leave Feedback</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}