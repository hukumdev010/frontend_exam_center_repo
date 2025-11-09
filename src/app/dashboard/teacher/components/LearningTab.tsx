import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function LearningTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Expand your knowledge and teaching skills</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500 mb-4">
                    Keep improving your skills with our certification programs.
                </p>
                <Button asChild>
                    <Link href="/certifications">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse Certifications
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}