"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Clock,
    MapPin,
    GraduationCap,
    ChevronRight,
    User
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

interface Teacher {
    id: number;
    user_id: string;
    user_name?: string;
    user_email: string;
    bio?: string;
    experience_years?: number;
    hourly_rate_one_on_one?: number;
    hourly_rate_group?: number;
    max_group_size: number;
    status: string;
    is_available: boolean;
    languages_spoken?: string;
    timezone?: string;
    qualifications?: TeacherQualification[];
}

export default function TeacherList() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch approved and available teachers
                const response = await fetch(
                    `${API_ENDPOINTS.base}/api/teachers/?status=approved&is_available=true&limit=6`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setTeachers(data);
            } catch (err) {
                console.error("Error fetching teachers:", err);
                setError("Failed to load teachers");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const getStatusBadge = (status: string, isAvailable: boolean) => {
        if (status === "approved" && isAvailable) {
            return <Badge className="bg-green-100 text-green-800">Available</Badge>;
        }
        if (status === "approved" && !isAvailable) {
            return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    };

    const formatRate = (rate?: number) => {
        if (!rate) return "Contact for pricing";
        return `$${rate}/hour`;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Available Teachers</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-3">
                                <div className="w-full h-4 bg-gray-200 rounded"></div>
                                <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                                    <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-4">
                    <User className="h-12 w-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (teachers.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                    <Users className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Available</h3>
                <p className="text-gray-600">Check back later for available teachers.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Meet Our Teachers</h2>
                    <p className="text-gray-600 mt-1">Connect with certified instructors</p>
                </div>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                    View All Teachers
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        {teacher.user_name || teacher.user_email?.split('@')[0] || 'Teacher'}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {teacher.experience_years ? `${teacher.experience_years} years experience` : 'Certified Instructor'}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(teacher.status, teacher.is_available)}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {teacher.bio && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {teacher.bio}
                                </p>
                            )}

                            <div className="space-y-2">
                                {teacher.qualifications && teacher.qualifications.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium">
                                            {teacher.qualifications.length} Certification{teacher.qualifications.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        1-on-1: {formatRate(teacher.hourly_rate_one_on_one)}
                                    </span>
                                </div>

                                {teacher.hourly_rate_group && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm">
                                            Group: {formatRate(teacher.hourly_rate_group)} (max {teacher.max_group_size})
                                        </span>
                                    </div>
                                )}

                                {teacher.languages_spoken && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">Speaks: {teacher.languages_spoken}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button variant="outline" className="w-full" size="sm">
                                    View Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center md:hidden">
                <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    View All Teachers
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}