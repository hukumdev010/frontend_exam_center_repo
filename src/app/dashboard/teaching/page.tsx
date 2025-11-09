"use client";

import { useState } from "react";
import { useSession } from "@/lib/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    GraduationCap,
    Users,
    Calendar,
    TrendingUp,
    BookOpen,
    Award,
    Clock,
    DollarSign,
    Star
} from "lucide-react";
import Link from "next/link";
import { useTeacherEligibility } from "@/hooks/useTeacherEligibility";

interface TeachingStats {
    totalStudents: number;
    totalSessions: number;
    averageRating: number;
    totalEarnings: number;
    upcomingSessions: number;
    completedSessions: number;
}

export default function TeachingHub() {
    const { data: session } = useSession();
    const { qualifications, isLoading } = useTeacherEligibility();
    const [stats] = useState<TeachingStats>({
        totalStudents: 0,
        totalSessions: 0,
        averageRating: 0,
        totalEarnings: 0,
        upcomingSessions: 0,
        completedSessions: 0
    });



    // Debug logging
    console.log("🎓 Teaching Hub - Qualifications:", {
        qualifications,
        isLoading,
        is_eligible_to_teach: qualifications?.is_eligible_to_teach
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!qualifications?.is_eligible_to_teach) {
        return (
            <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Not Eligible for Teaching Yet
                </h2>
                <p className="text-gray-600 mb-6">
                    You need to qualify for teaching by scoring 90%+ on certifications and getting approved.
                </p>
                <Link href="/dashboard/qualifications">
                    <Button>View Qualification Requirements</Button>
                </Link>
            </div>
        );
    }

    const qualificationCount = qualifications?.qualifications_count || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome to Your Teaching Hub, {session?.user?.name || 'Teacher'}!
                        </h1>
                        <p className="text-blue-100">
                            You&apos;re qualified to teach {qualificationCount} subject{qualificationCount !== 1 ? 's' : ''}.
                            Start sharing your knowledge with students worldwide.
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            Approved Teacher
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Active learners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSessions}</div>
                        <p className="text-xs text-muted-foreground">+{stats.upcomingSessions} upcoming</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">From student reviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common teaching tasks and management
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/dashboard/teaching/sessions" className="block">
                            <Button className="w-full justify-start" variant="outline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule New Session
                            </Button>
                        </Link>

                        <Link href="/dashboard/teaching/students" className="block">
                            <Button className="w-full justify-start" variant="outline">
                                <Users className="h-4 w-4 mr-2" />
                                View My Students
                            </Button>
                        </Link>

                        <Link href="/dashboard/teaching/availability" className="block">
                            <Button className="w-full justify-start" variant="outline">
                                <Clock className="h-4 w-4 mr-2" />
                                Update Availability
                            </Button>
                        </Link>

                        <Link href="/dashboard/qualifications" className="block">
                            <Button className="w-full justify-start" variant="outline">
                                <Award className="h-4 w-4 mr-2" />
                                My Qualifications
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Teaching Subjects */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Your Teaching Subjects</CardTitle>
                        <CardDescription>
                            Subjects you&apos;re qualified to teach based on your certifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {qualifications?.qualifications_by_subject &&
                            Object.keys(qualifications.qualifications_by_subject).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(qualifications.qualifications_by_subject).map(([subject, quals]) => (
                                    <div key={subject} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-lg">{subject}</h4>
                                            <Badge variant="secondary">
                                                {quals.length} Certification{quals.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {quals.map((qual, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <span className="text-gray-800 font-medium">{qual.certification_name}</span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                                {qual.score}% Score
                                                            </Badge>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(qual.qualified_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Link href={`/syllabus/${qual.certification_slug}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="ml-3"
                                                        >
                                                            <BookOpen className="w-4 h-4" />
                                                            <span className="ml-1">Syllabus</span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                <p>No teaching subjects found. This might be a data loading issue.</p>
                                <Link href="/dashboard/qualifications">
                                    <Button variant="outline" className="mt-2">
                                        Check Qualifications
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Teaching Activity</CardTitle>
                    <CardDescription>
                        Your latest sessions and student interactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>No recent activity yet. Start teaching to see your activity here!</p>
                        <Link href="/dashboard/teaching/sessions">
                            <Button className="mt-4">
                                Schedule Your First Session
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}