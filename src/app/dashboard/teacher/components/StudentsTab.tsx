import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function StudentsTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-gray-600">View and manage your student interactions</p>
            </div>

            <Card>
                <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Student management coming soon</h3>
                    <p className="text-gray-600 mb-6">Advanced student tracking and communication features will be available here</p>
                </CardContent>
            </Card>
        </div>
    );
}