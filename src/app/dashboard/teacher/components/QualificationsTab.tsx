import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import Link from "next/link";
import { TeacherProfile } from "../services";

interface QualificationsTabProps {
    teacherProfile: TeacherProfile;
}

export function QualificationsTab({ teacherProfile }: QualificationsTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Your Qualifications</h2>
                <p className="text-gray-600">Subjects you&apos;re qualified to teach (90%+ score required)</p>
            </div>

            {teacherProfile.qualifications.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No qualifications yet</h3>
                        <p className="text-gray-600 mb-6">Take certification exams and score 90%+ to qualify as a teacher</p>
                        <Link href="/quiz">
                            <Button>Take Certification Exams</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {teacherProfile.qualifications.map((qual) => (
                        <Card key={qual.id}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium">{qual.certification_name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{qual.category_name}</p>
                                        <p className="text-xs text-gray-500">
                                            Qualified on {new Date(qual.qualified_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-yellow-500" />
                                            <span className="text-lg font-bold text-green-600">{qual.score}%</span>
                                        </div>
                                        <Badge variant="secondary">Qualified</Badge>
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