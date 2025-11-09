"use client"

import { Button } from "@/components/ui/button";
import {
    Users,
    User,
    ChevronRight,
} from "lucide-react";
import { useTeachers } from "@/hooks/useApi";
import TeacherCard from "./TeacherCard";


interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

interface TeacherCardProps {
    id: number;
    user_name?: string;
    user_email?: string;
    bio?: string;
    experience_years?: number;
    qualifications?: TeacherQualification[];
    status: 'pending' | 'approved' | 'rejected';
    is_available: boolean;
    hourly_rate_one_on_one?: number;
    hourly_rate_group?: number;
    max_group_size?: number;
    languages_spoken?: string;
}


// Use TeacherCardProps as the main Teacher interface since it matches the API response
type Teacher = TeacherCardProps;

interface TeacherListProps {
    filters?: {
        selectedTeachers: string[];
        searchQuery: string;
    };
}

export default function TeacherList({ filters }: TeacherListProps) {
    const { data: teachersData = [], isLoading, error } = useTeachers("approved", true, 20, filters?.searchQuery);
    let teachers = teachersData as Teacher[];

    // Apply local filters (only for selectedTeachers since search is now handled by API)
    if (filters && filters.selectedTeachers.length > 0) {
        teachers = teachers.filter(teacher => {
            // Filter by selected teachers (if specific teachers are selected)
            const isSelected = filters.selectedTeachers.some(selectedTeacher =>
                teacher.user_name?.includes(selectedTeacher)
            );
            return isSelected;
        });
    }

    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="h-7 bg-gray-200 rounded w-56 mx-auto mb-3 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-72 mx-auto animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-200/50 p-4 bg-gradient-to-br from-white to-gray-50/50 animate-pulse">
                            <div className="flex items-start mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-red-500 mb-6">
                        <User className="h-16 w-16 mx-auto opacity-50" />
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-red-600 text-center">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (teachers.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet Our Teachers</h2>
                    <p className="text-gray-600 text-lg">Connect with certified instructors</p>
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-6">
                        <Users className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">No Teachers Available</h3>
                    <p className="text-gray-600 text-lg">Check back later for available teachers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 w-full max-w-7xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet Our Teachers</h2>
                <p className="text-gray-600 text-lg">Connect with certified instructors</p>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                        {teachers.length} available teachers
                    </span>
                </div>
                <Button variant="outline" className="hidden md:flex items-center gap-2 text-sm">
                    View All Teachers
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teachers.map((teacher) => (
                    <TeacherCard
                        key={teacher.id}
                        {...teacher}
                        onClick={() => {
                            // TODO: Navigate to teacher profile page
                            console.log('Navigate to teacher:', teacher.id);
                        }}
                    />
                ))}
            </div>

            <div className="text-center md:hidden mt-8">
                <Button variant="outline" className="flex items-center gap-2 mx-auto text-sm">
                    View All Teachers
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}