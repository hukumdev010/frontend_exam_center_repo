import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { AvailableSession } from "../services";

interface SessionsTabProps {
    availableSessions: AvailableSession[];
}

export function SessionsTab({ availableSessions }: SessionsTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Available Sessions</h2>
                <p className="text-gray-600">Find and book sessions with qualified teachers</p>
            </div>

            {availableSessions.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No sessions available</h3>
                        <p className="text-gray-600 mb-6">Check back later for new teaching sessions</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {availableSessions.map((ses) => (
                        <Card key={ses.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{ses.title}</CardTitle>
                                        <CardDescription className="mt-2">{ses.description}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${ses.session_fee}</p>
                                        <p className="text-sm text-gray-600">per session</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(ses.scheduled_for).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{ses.duration_hours} hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>{ses.bookings_count}/{ses.max_participants} booked</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{ses.location_type}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <p>Teacher: {ses.teacher_name}</p>
                                        <p>Category: {ses.category_name}</p>
                                    </div>
                                    <Button>Book Session</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}