"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Star,
    Clock,
    DollarSign,
    BookOpen,
    Calendar,
    MapPin,
    Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Teacher {
    id: number;
    name: string;
    avatar?: string;
    bio: string;
    subjects: string[];
    rating: number;
    reviews_count: number;
    hourly_rate: number;
    experience_years: number;
    availability_status: 'available' | 'busy' | 'offline';
    next_available: string;
    languages: string[];
    location: string;
    total_students: number;
    completed_lessons: number;
}

export default function FindTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [sortBy, setSortBy] = useState("rating");

    // Mock data for now - replace with API call
    useEffect(() => {
        const mockTeachers: Teacher[] = [
            {
                id: 1,
                name: "Sarah Johnson",
                bio: "Experienced mathematics teacher with 8+ years of teaching calculus, algebra, and statistics. Passionate about making complex concepts simple.",
                subjects: ["Mathematics", "Calculus", "Statistics"],
                rating: 4.9,
                reviews_count: 127,
                hourly_rate: 35,
                experience_years: 8,
                availability_status: 'available',
                next_available: "Today at 2:00 PM",
                languages: ["English", "Spanish"],
                location: "New York, USA",
                total_students: 89,
                completed_lessons: 542
            },
            {
                id: 2,
                name: "Dr. Ahmed Hassan",
                bio: "PhD in Computer Science with specialization in algorithms and data structures. Currently working as a senior software engineer.",
                subjects: ["Computer Science", "Programming", "Algorithms"],
                rating: 4.8,
                reviews_count: 94,
                hourly_rate: 45,
                experience_years: 12,
                availability_status: 'busy',
                next_available: "Tomorrow at 10:00 AM",
                languages: ["English", "Arabic"],
                location: "London, UK",
                total_students: 67,
                completed_lessons: 389
            },
            {
                id: 3,
                name: "Maria Rodriguez",
                bio: "Native Spanish speaker and certified language instructor. Specializes in conversational Spanish and business communication.",
                subjects: ["Spanish", "Language Arts"],
                rating: 4.7,
                reviews_count: 156,
                hourly_rate: 28,
                experience_years: 6,
                availability_status: 'available',
                next_available: "Today at 4:30 PM",
                languages: ["Spanish", "English", "Portuguese"],
                location: "Barcelona, Spain",
                total_students: 123,
                completed_lessons: 678
            }
        ];

        // Simulate API call
        setTimeout(() => {
            setTeachers(mockTeachers);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subjects.some(subject =>
                subject.toLowerCase().includes(searchQuery.toLowerCase())
            );
        const matchesSubject = !selectedSubject || selectedSubject === "all" || teacher.subjects.includes(selectedSubject);
        return matchesSearch && matchesSubject;
    });

    const sortedTeachers = [...filteredTeachers].sort((a, b) => {
        switch (sortBy) {
            case "rating":
                return b.rating - a.rating;
            case "price_low":
                return a.hourly_rate - b.hourly_rate;
            case "price_high":
                return b.hourly_rate - a.hourly_rate;
            case "experience":
                return b.experience_years - a.experience_years;
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
        const subjects = new Set<string>();
        teachers.forEach(teacher => {
            teacher.subjects.forEach(subject => subjects.add(subject));
        });
        return Array.from(subjects).sort();
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Find Teachers</h1>
                        <p className="text-muted-foreground">
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
                                        <AvatarImage src={teacher.avatar} />
                                        <AvatarFallback>
                                            {teacher.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{teacher.name}</CardTitle>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span>{teacher.rating}</span>
                                            <span>({teacher.reviews_count} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={getAvailabilityColor(teacher.availability_status)}>
                                    {teacher.availability_status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {teacher.bio}
                            </p>

                            {/* Subjects */}
                            <div className="flex flex-wrap gap-1">
                                {teacher.subjects.map((subject) => (
                                    <Badge key={subject} variant="secondary" className="text-xs">
                                        {subject}
                                    </Badge>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span>${teacher.hourly_rate}/hour</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                                    <span>{teacher.experience_years} years</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">{teacher.next_available}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs truncate">{teacher.location}</span>
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