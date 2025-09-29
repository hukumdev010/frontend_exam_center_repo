import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { SessionBooking } from "../services";

interface BookingsTabProps {
    bookings: SessionBooking[];
    getBookingStatusColor: (status: string) => string;
}

export function BookingsTab({ bookings, getBookingStatusColor }: BookingsTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <p className="text-gray-600">View and manage your session bookings</p>
            </div>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">Book a teaching session to start learning with an expert</p>
                        <Link href="/sessions">
                            <Button>Browse Sessions</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {booking.session.title}
                                            <Badge className={getBookingStatusColor(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {booking.session.description}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">${booking.session.session_fee}</p>
                                        <p className="text-sm text-gray-600">session fee</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(booking.session.scheduled_for).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{booking.session.duration_hours} hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{booking.session.location_type}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <p>Teacher: {booking.session.teacher_name}</p>
                                        <p>Booked: {new Date(booking.booking_date).toLocaleDateString()}</p>
                                        {booking.feedback_rating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span>Rated {booking.feedback_rating}/5</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {booking.status === "confirmed" && (
                                            <Button variant="outline" size="sm">Cancel</Button>
                                        )}
                                        {booking.status === "completed" && !booking.feedback_rating && (
                                            <Button size="sm">Leave Feedback</Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}