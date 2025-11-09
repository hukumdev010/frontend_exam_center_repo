import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function StudentsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>Students you&apos;re currently teaching</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500 mb-4">
                    This feature is coming soon. You&apos;ll be able to see all your students and their progress here.
                </p>
                <Button variant="outline" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    View All Students
                </Button>
            </CardContent>
        </Card>
    );
}