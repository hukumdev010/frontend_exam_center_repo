import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, GraduationCap, Settings, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { TeacherProfile } from "../services";

interface TeacherDashboardHeaderProps {
    teacherProfile: TeacherProfile;
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
        case "pending":
            return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
        case "rejected":
            return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export function TeacherDashboardHeader({ teacherProfile }: TeacherDashboardHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Teaching Dashboard</h1>
                        <p className="text-gray-600 mt-2">Your teaching features - continue learning while helping others</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Student Features Active
                            </Badge>
                            <Badge variant="default" className="text-xs">
                                <GraduationCap className="w-3 h-3 mr-1" />
                                Teaching Enabled
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {getStatusBadge(teacherProfile.status)}
                    <Link href="/dashboard/teacher/profile">
                        <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Profile Settings
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}