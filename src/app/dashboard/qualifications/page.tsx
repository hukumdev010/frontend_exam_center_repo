"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Award, Plus, Info, Target } from "lucide-react";
import Link from "next/link";

interface Qualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
    can_teach: boolean;
    is_teaching: boolean;
}

export default function QualificationsPage() {
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingToTeach, setApplyingToTeach] = useState<number | null>(null);

    useEffect(() => {
        // Fetch user qualifications
        fetchQualifications();
    }, []);

    const fetchQualifications = async () => {
        try {
            const response = await fetch('/api/users/qualifications');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setQualifications(data.qualifications || []);
        } catch (error) {
            console.error('Error fetching qualifications:', error);
            // Set empty array if API call fails
            setQualifications([]);
        } finally {
            setLoading(false);
        }
    };

    const applyToTeachSubject = async (certificationId: number) => {
        setApplyingToTeach(certificationId);
        try {
            const response = await fetch(`/api/teachers/apply-subject/${certificationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to apply for teaching');
            }

            // Refresh qualifications to update the UI
            await fetchQualifications();

            // Show success message (you can add toast notification here)
            console.log('Successfully applied to teach this subject!');

        } catch (error) {
            console.error('Error applying to teach:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Failed to apply'}`);
        } finally {
            setApplyingToTeach(null);
        }
    };

    if (loading) {
        return <div className="p-6">Loading qualifications...</div>;
    }

    const hasQualifications = qualifications.length > 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">
                        {hasQualifications ? "My Teaching Qualifications" : "Become a Teacher"}
                    </h1>
                    <p className="text-muted-foreground">
                        {hasQualifications
                            ? "Your teaching qualifications and eligible subjects"
                            : "Get certified in subjects to start teaching and earning"
                        }
                    </p>
                </div>
            </div>

            {!hasQualifications && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Complete subject certifications with a passing score to become eligible to teach those subjects.
                        Once qualified, you can set your availability and start accepting students.
                    </AlertDescription>
                </Alert>
            )}

            {qualifications.length === 0 ? (
                <div className="grid gap-6">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Target className="h-16 w-16 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-semibold mb-2">Start Your Teaching Journey</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Browse subjects, take certification quizzes, and become a qualified teacher.
                                Earn money by teaching subjects you&apos;re passionate about.
                            </p>
                            <div className="space-y-3">
                                <Link href="/dashboard/categories">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Browse Subjects to Certify
                                    </Button>
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                    Pass certification quizzes to unlock teaching opportunities
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Teaching Qualifications</h2>
                        <Link href="/dashboard/categories">
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Get More Qualifications
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {qualifications.map((qualification) => (
                            <Card key={qualification.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="h-5 w-5 text-green-600" />
                                            {qualification.certification_name}
                                        </CardTitle>
                                        <Badge variant="secondary">
                                            {qualification.category_name}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Certification Score: {qualification.score}% • Qualified on{' '}
                                        {new Date(qualification.qualified_at).toLocaleDateString()}
                                        {qualification.can_teach && (
                                            <span className="block text-green-600 mt-1">
                                                🎯 Eligible to teach (scored 90%+)
                                            </span>
                                        )}
                                        {!qualification.can_teach && qualification.score >= 80 && (
                                            <span className="block text-amber-600 mt-1">
                                                📚 Certified but need 90%+ to teach
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {qualification.score >= 80 && (
                                                <Badge variant="outline" className="text-blue-700 border-blue-200">
                                                    ✓ Certified
                                                </Badge>
                                            )}
                                            {qualification.can_teach && (
                                                <Badge variant="outline" className="text-green-700 border-green-200">
                                                    ✓ Teaching Eligible
                                                </Badge>
                                            )}
                                            {qualification.is_teaching && (
                                                <Badge variant="outline" className="text-purple-700 border-purple-200">
                                                    🎓 Teaching Active
                                                </Badge>
                                            )}
                                        </div>

                                        {qualification.can_teach && !qualification.is_teaching && (
                                            <Button
                                                onClick={() => applyToTeachSubject(qualification.id)}
                                                disabled={applyingToTeach === qualification.id}
                                                size="sm"
                                                variant="outline"
                                            >
                                                {applyingToTeach === qualification.id ? 'Applying...' : 'Apply to Teach'}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}