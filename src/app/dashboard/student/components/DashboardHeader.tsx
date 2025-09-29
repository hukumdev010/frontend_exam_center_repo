import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
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
                        <h1 className="text-3xl font-bold text-gray-900">Learning Portal</h1>
                        <p className="text-gray-600 mt-2">Your comprehensive learning dashboard - track progress and continue growing</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className="bg-blue-100 text-blue-800">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Learning Mode
                    </Badge>
                    <Link href="/profile">
                        <Button variant="outline" size="sm">
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}