import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { AvailableSession } from "../services";

interface AvailableSessionsProps {
    availableSessions: AvailableSession[];
}

export function AvailableSessions({ availableSessions }: AvailableSessionsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Available Teaching Sessions</CardTitle>
                    <CardDescription>Get help from qualified teachers</CardDescription>
                </div>
                <Link href="/sessions">
                    <Button variant="outline" size="sm">View All</Button>
                </Link>
            </CardHeader>
            <CardContent>
                {availableSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No sessions available right now</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {availableSessions.slice(0, 2).map((ses) => (
                            <div key={ses.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium">{ses.title}</h3>
                                        <Badge variant="outline">{ses.category_name}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(ses.scheduled_for).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {ses.duration_hours}h
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {ses.location_type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Teacher: {ses.teacher_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${ses.session_fee}</p>
                                    <Button size="sm" className="mt-2">Book Session</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}