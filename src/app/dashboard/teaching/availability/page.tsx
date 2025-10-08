"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, DollarSign, Save } from "lucide-react";

interface TimeSlot {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

interface SubjectRate {
    id: number;
    name: string;
    oneOnOneRate: number;
    groupRate: number;
    isActive: boolean;
}

export default function AvailabilityPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
        { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: false },
        { id: '4', day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: '5', day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: '6', day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
        { id: '7', day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: false },
    ]);

    const [subjectRates, setSubjectRates] = useState<SubjectRate[]>([
        { id: 1, name: 'JavaScript Fundamentals', oneOnOneRate: 50, groupRate: 30, isActive: true },
        { id: 2, name: 'React Development', oneOnOneRate: 60, groupRate: 35, isActive: true },
        { id: 3, name: 'Node.js Backend', oneOnOneRate: 55, groupRate: 32, isActive: false },
    ]);

    const handleTimeSlotToggle = (id: string) => {
        setTimeSlots(prev => prev.map(slot =>
            slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
        ));
    };

    const handleTimeChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
        setTimeSlots(prev => prev.map(slot =>
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
    };

    const handleRateChange = (id: number, field: 'oneOnOneRate' | 'groupRate', value: string) => {
        setSubjectRates(prev => prev.map(subject =>
            subject.id === id ? { ...subject, [field]: parseFloat(value) || 0 } : subject
        ));
    };

    const handleSubjectToggle = (id: number) => {
        setSubjectRates(prev => prev.map(subject =>
            subject.id === id ? { ...subject, isActive: !subject.isActive } : subject
        ));
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Teaching Availability</h1>
                    <p className="text-muted-foreground">Manage your availability and rates for teaching sessions</p>
                </div>
                <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            {/* Weekly Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Weekly Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {timeSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="w-20">
                                    <Label className="font-medium">{slot.day}</Label>
                                </div>
                                <Switch
                                    checked={slot.isAvailable}
                                    onCheckedChange={() => handleTimeSlotToggle(slot.id)}
                                />
                                <div className="flex items-center gap-2 flex-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(e) => handleTimeChange(slot.id, 'startTime', e.target.value)}
                                        disabled={!slot.isAvailable}
                                        className="w-32"
                                    />
                                    <span className="text-muted-foreground">to</span>
                                    <Input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(e) => handleTimeChange(slot.id, 'endTime', e.target.value)}
                                        disabled={!slot.isAvailable}
                                        className="w-32"
                                    />
                                </div>
                                <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                                    {slot.isAvailable ? "Available" : "Unavailable"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Subject Rates */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Hourly Rates by Subject
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {subjectRates.map((subject) => (
                            <div key={subject.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-medium">{subject.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Teaching qualification earned
                                    </p>
                                </div>
                                <Switch
                                    checked={subject.isActive}
                                    onCheckedChange={() => handleSubjectToggle(subject.id)}
                                />
                                <div className="flex items-center gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs">One-on-One</Label>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">$</span>
                                            <Input
                                                type="number"
                                                value={subject.oneOnOneRate}
                                                onChange={(e) => handleRateChange(subject.id, 'oneOnOneRate', e.target.value)}
                                                disabled={!subject.isActive}
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground">/hr</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Group Session</Label>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">$</span>
                                            <Input
                                                type="number"
                                                value={subject.groupRate}
                                                onChange={(e) => handleRateChange(subject.id, 'groupRate', e.target.value)}
                                                disabled={!subject.isActive}
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground">/hr</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={subject.isActive ? "default" : "secondary"}>
                                    {subject.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Teaching Tips */}
            <Card>
                <CardHeader>
                    <CardTitle>Teaching Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-medium">Setting Availability</h4>
                            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                <li>Set realistic time slots you can consistently maintain</li>
                                <li>Consider time zones of your potential students</li>
                                <li>Leave buffer time between sessions</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Pricing Strategy</h4>
                            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                <li>Research market rates for your subjects</li>
                                <li>Group sessions should cost less per student</li>
                                <li>Higher rates for specialized or advanced topics</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}