import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TeacherProfile } from "../services";

export function QualificationsTab({ teacherProfile }: { teacherProfile: TeacherProfile }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Qualifications & Expertise</CardTitle>
                <CardDescription>Your professional background and certifications</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Bio</h4>
                        <p className="text-gray-600">{teacherProfile.bio || 'No bio provided'}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Experience</h4>
                        <p className="text-gray-600">
                            {teacherProfile.experience_years ? `${teacherProfile.experience_years} years` : 'Not specified'}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Education</h4>
                        <p className="text-gray-600">{teacherProfile.education || 'Not specified'}</p>
                    </div>

                    {teacherProfile.specializations && teacherProfile.specializations.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Specializations</h4>
                            <div className="flex flex-wrap gap-2">
                                {teacherProfile.specializations.map((spec, index) => (
                                    <Badge key={index} variant="secondary">{spec}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {teacherProfile.certifications && teacherProfile.certifications.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                                {teacherProfile.certifications.map((cert, index) => (
                                    <Badge key={index} variant="outline">{cert}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button variant="outline" asChild>
                        <Link href="/dashboard/teacher/profile/edit">
                            Edit Qualifications
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}