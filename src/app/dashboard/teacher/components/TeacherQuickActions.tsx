import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export function TeacherQuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <Button asChild className="h-16">
                        <Link href="/dashboard/teacher/sessions/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Session
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-16">
                        <Link href="/dashboard/teacher/profile">
                            <Users className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-16">
                        <Link href="/certifications">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Browse Certifications
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-16">
                        <Link href="/dashboard/teacher/analytics">
                            <Award className="h-4 w-4 mr-2" />
                            View Analytics
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}