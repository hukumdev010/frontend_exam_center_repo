import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

interface CertificationsCardProps {
    certifications_earned: string[];
}

export function CertificationsCard({ certifications_earned }: CertificationsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Platform Achievements
                </CardTitle>
                <CardDescription>
                    Your earned certifications on this platform
                </CardDescription>
            </CardHeader>
            <CardContent>
                {certifications_earned.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {certifications_earned.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {cert}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No certifications earned yet</p>
                        <p className="text-sm mt-1">
                            Complete quizzes with 80%+ scores to earn certifications for teaching eligibility
                        </p>
                        <Link href="/dashboard/categories">
                            <Button className="mt-3" size="sm">
                                Browse Certifications
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}