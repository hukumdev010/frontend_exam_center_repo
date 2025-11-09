"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Mail,
    Calendar,
    BookOpen,
    Star,
    MessageSquare
} from "lucide-react";
import Link from "next/link";

interface Student {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    sessionsCompleted: number;
    totalSessions: number;
    subjects: string[];
    lastSession?: string;
    rating?: number;
}

export default function MyStudents() {
    const [students] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading] = useState(false);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subjects.some(subject =>
            subject.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                    <p className="text-gray-600">
                        Manage your student relationships and track their progress
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="px-3 py-1">
                        {students.length} Total Students
                    </Badge>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Find Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by name, email, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Students List */}
            {students.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Students Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You haven&apos;t taught any students yet. Start by creating teaching sessions
                            to attract students to your subjects.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/dashboard/teaching/sessions">
                                <Button>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Create Session
                                </Button>
                            </Link>
                            <Link href="/dashboard/teaching/availability">
                                <Button variant="outline">
                                    Set Availability
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <Card key={student.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{student.name}</CardTitle>
                                    {student.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{student.rating}</span>
                                        </div>
                                    )}
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    {student.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Progress */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Sessions Progress</span>
                                        <span>{student.sessionsCompleted}/{student.totalSessions}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${(student.sessionsCompleted / student.totalSessions) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Subjects:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {student.subjects.map((subject, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium">Joined</p>
                                        <p>{new Date(student.joinDate).toLocaleDateString()}</p>
                                    </div>
                                    {student.lastSession && (
                                        <div>
                                            <p className="font-medium">Last Session</p>
                                            <p>{new Date(student.lastSession).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm" className="flex-1">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Message
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <BookOpen className="h-3 w-3 mr-1" />
                                        Progress
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>
                        Tools to help you manage your teaching relationships
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/dashboard/teaching/sessions" className="block">
                            <Button className="w-full" variant="outline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Group Session
                            </Button>
                        </Link>

                        <Button className="w-full" variant="outline" disabled>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Announcement
                        </Button>

                        <Button className="w-full" variant="outline" disabled>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Create Study Material
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}