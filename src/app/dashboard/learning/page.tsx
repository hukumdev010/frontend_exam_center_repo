"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, TrendingUp, Target } from "lucide-react";

interface LearningStats {
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    certifications: number;
    categoriesProgress: CategoryProgress[];
}

interface CategoryProgress {
    id: number;
    name: string;
    totalQuizzes: number;
    completedQuizzes: number;
    bestScore: number;
    progress: number;
}

export default function LearningProgressPage() {
    const { getAuthHeaders } = useSession();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<LearningStats | null>(null);

    useEffect(() => {
        loadLearningStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadLearningStats = async () => {
        try {
            // This would be replaced with actual API calls
            const mockStats: LearningStats = {
                totalQuizzes: 45,
                completedQuizzes: 32,
                averageScore: 78,
                certifications: 3,
                categoriesProgress: [
                    {
                        id: 1,
                        name: "JavaScript Fundamentals",
                        totalQuizzes: 15,
                        completedQuizzes: 12,
                        bestScore: 92,
                        progress: 80
                    },
                    {
                        id: 2,
                        name: "React Development",
                        totalQuizzes: 20,
                        completedQuizzes: 15,
                        bestScore: 88,
                        progress: 75
                    },
                    {
                        id: 3,
                        name: "Node.js Backend",
                        totalQuizzes: 10,
                        completedQuizzes: 5,
                        bestScore: 65,
                        progress: 50
                    }
                ]
            };
            setStats(mockStats);
        } catch (error) {
            console.error("Error loading learning stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) {
        return <div className="p-6">No learning data available.</div>;
    }

    const completionRate = (stats.completedQuizzes / stats.totalQuizzes) * 100;

    return (
        <div className="p-6 space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedQuizzes} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageScore}%</div>
                        <p className="text-xs text-muted-foreground">
                            Across all quizzes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certifications}</div>
                        <p className="text-xs text-muted-foreground">
                            Certificates earned
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                        <Progress value={completionRate} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Category Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.categoriesProgress.map((category) => (
                            <div key={category.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium">{category.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {category.completedQuizzes}/{category.totalQuizzes} quizzes completed
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Badge variant={category.bestScore >= 90 ? "default" : "secondary"}>
                                            Best: {category.bestScore}%
                                        </Badge>
                                        {category.bestScore >= 90 && (
                                            <Badge variant="default" className="ml-2 bg-green-100 text-green-800">
                                                Teaching Qualified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Progress value={category.progress} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}