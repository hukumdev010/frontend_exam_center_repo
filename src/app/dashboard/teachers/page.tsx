"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Search,
    Clock,
    DollarSign,
    BookOpen,
    Calendar,
    MapPin,
    Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeachers } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";

interface Teacher {
    id: number;
    user_id: string;
    bio?: string;
    experience_years?: number;
    hourly_rate_one_on_one?: number;
    hourly_rate_group?: number;
    max_group_size?: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    is_available: boolean;
    languages_spoken?: string;
    timezone?: string;
    created_at: string;
    updated_at: string;
}

export default function TeachersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [sortBy, setSortBy] = useState("rating");

    // Debounced search with 300ms delay
    const debouncedSearch = useDebounce((query: string) => {
        setDebouncedSearchQuery(query);
    }, 300);

    // Update debounced search when searchQuery changes
    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    // Use SWR hook for teachers data  
    const { data: teachersData = [], isLoading: loading, error } = useTeachers();
    const teachers = Array.isArray(teachersData) ? teachersData as Teacher[] : [];

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.user_id?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            teacher.bio?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        // Note: We don't have subjects field in the API, so we'll just use the search query for now
        const matchesSubject = selectedSubject === "all" || !selectedSubject;
        return matchesSearch && matchesSubject;
    });

    const sortedTeachers = [...filteredTeachers].sort((a, b) => {
        switch (sortBy) {
            case "rating":
                // Since we don't have rating, sort by status (approved first)
                return a.status === 'approved' ? -1 : 1;
            case "price_low":
                return (a.hourly_rate_one_on_one || 0) - (b.hourly_rate_one_on_one || 0);
            case "price_high":
                return (b.hourly_rate_one_on_one || 0) - (a.hourly_rate_one_on_one || 0);
            case "experience":
                return (b.experience_years || 0) - (a.experience_years || 0);
            default:
                return 0;
        }
    });

    const getAvailabilityColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAllSubjects = () => {
        // Since we don't have subjects in the API response, return empty array for now
        // This could be enhanced to fetch categories/certifications separately
        return [];
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Teachers</h1>
                        <div className="text-red-600">Error loading teachers. Please try refreshing the page.</div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Teachers</h1>
                        <p className="text-gray-600">
                            Connect with qualified teachers for personalized learning
                        </p>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                        <div className="h-3 w-24 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-gray-200 rounded" />
                                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                                    <div className="h-8 w-full bg-gray-200 rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find Teachers</h1>
                    <p className="text-muted-foreground">
                        Connect with qualified teachers for personalized learning
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search teachers or subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {getAllSubjects().map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="price_low">Price: Low to High</SelectItem>
                                <SelectItem value="price_high">Price: High to Low</SelectItem>
                                <SelectItem value="experience">Most Experienced</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="w-full">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedTeachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>
                                            {teacher.user_id.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{teacher.user_id}</CardTitle>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <span className="capitalize">{teacher.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={getAvailabilityColor(teacher.is_available ? 'available' : 'offline')}>
                                    {teacher.is_available ? 'Available' : 'Offline'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {teacher.bio || 'No bio available'}
                            </p>

                            {/* Languages */}
                            {teacher.languages_spoken && (
                                <div className="flex flex-wrap gap-1">
                                    {(() => {
                                        try {
                                            const languages = JSON.parse(teacher.languages_spoken);
                                            return Array.isArray(languages) ? languages.map((language: string) => (
                                                <Badge key={language} variant="secondary" className="text-xs">
                                                    {language}
                                                </Badge>
                                            )) : null;
                                        } catch {
                                            return (
                                                <Badge variant="secondary" className="text-xs">
                                                    {teacher.languages_spoken}
                                                </Badge>
                                            );
                                        }
                                    })()}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span>${teacher.hourly_rate_one_on_one || 0}/hour</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                                    <span>{teacher.experience_years || 0} years</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">{teacher.timezone || 'No timezone set'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs truncate">Max {teacher.max_group_size || 0} students</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                                <Button size="sm" className="flex-1">
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Book Lesson
                                </Button>
                                <Button size="sm" variant="outline">
                                    Message
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTeachers.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search criteria or browse all subjects.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}