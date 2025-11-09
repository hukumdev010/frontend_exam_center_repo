import React from "react";
import { Badge } from "@/components/ui/badge";
import { TeacherProfile } from "../services";

export function TeacherDashboardHeader({ teacherProfile }: { teacherProfile: TeacherProfile }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, {teacherProfile.user?.first_name || teacherProfile.user?.username || 'Teacher'}!
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Ready to inspire and teach today?
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant={teacherProfile.status === 'approved' ? 'default' : 'secondary'}>
                        {teacherProfile.status.charAt(0).toUpperCase() + teacherProfile.status.slice(1)}
                    </Badge>
                </div>
            </div>
        </div>
    );
}