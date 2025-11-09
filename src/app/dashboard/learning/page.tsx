"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Clock, CheckCircle, PlayCircle, Play } from "lucide-react";
import { useLearningStats, useUserProgress, useUserActivity } from "@/hooks/useApi";

// Type definition for activity items
interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description?: string;
    score?: number;
    certification_name?: string;
    certification_id?: number;
    points?: number;
    created_at: string;
}

export default function LearningProgressPage() {
    const router = useRouter();
    const [activityLimit, setActivityLimit] = useState(20);
    const [loadingActivity, setLoadingActivity] = useState(false);

    // Use SWR hooks for data fetching
    const { data: stats, isLoading: statsLoading, error: statsError } = useLearningStats();
    const { data: userProgressRaw, isLoading: progressLoading, error: progressError } = useUserProgress();
    const { data: activityData, isLoading: activityLoading, error: activityError } = useUserActivity(activityLimit);

    // Type cast userProgress to ensure it's an array
    const userProgress = Array.isArray(userProgressRaw) ? userProgressRaw : [];

    // Derive computed values
    const loading = statsLoading || progressLoading || activityLoading;
    const error = statsError || progressError || activityError;
    const allActivity = activityData?.activities || [];
    const activityTotal = activityData?.total_count || 0;

    const retryLoadingData = () => {
        // With SWR, we can just refresh the page or mutate the cache
        window.location.reload();
    };

    const loadMoreActivity = async () => {
        try {
            setLoadingActivity(true);
            const newLimit = activityLimit + 20;
            setActivityLimit(newLimit);
            // SWR will automatically refetch with the new limit
        } catch (error) {
            console.error("Error loading more activity:", error);
        } finally {
            setLoadingActivity(false);
        }
    };

    const handleContinueQuiz = (certificationSlug: string) => {
        router.push(`/quiz/${certificationSlug}`);
    };

    const handleStartCertification = (certificationSlug: string) => {
        router.push(`/quiz/${certificationSlug}/info`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-sm text-muted-foreground">Loading your learning progress...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card className="border-red-200">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error?.message || 'Failed to load learning data. Please try again.'}</p>
                            <button
                                onClick={retryLoadingData}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No learning data available yet.</p>
                            <p className="text-sm mt-2">Start taking some quizzes to track your progress!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Continue Learning Section - Moved to top */}
            {userProgress.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Continue Learning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userProgress
                                .filter(progress => !progress.is_completed && progress.current_question > 0)
                                .slice(0, 6)
                                .map((progress) => (
                                    <Card key={progress.id} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm line-clamp-2">
                                                            {progress.certification.name}
                                                        </h4>
                                                        {progress.certification.category && (
                                                            <Badge variant="outline" className="text-xs mt-1">
                                                                {progress.certification.category.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>
                                                            Question {progress.current_question} of {progress.total_questions}
                                                        </span>
                                                        <span>
                                                            {Math.round((progress.current_question / progress.total_questions) * 100)}%
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={(progress.current_question / progress.total_questions) * 100}
                                                        className="h-2"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center pt-2">
                                                    <div className="text-xs text-muted-foreground">
                                                        {progress.points} points earned
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleContinueQuiz(progress.certification.slug)}
                                                        className="h-7 text-xs"
                                                    >
                                                        Continue
                                                        <PlayCircle className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>

                        {/* Show message if no in-progress certifications */}
                        {userProgress.filter(progress => !progress.is_completed && progress.current_question > 0).length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                <PlayCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No certifications in progress</p>
                                <p className="text-sm mt-1">Start a new certification to begin learning!</p>
                                <Button
                                    className="mt-4"
                                    onClick={() => router.push('/certifications')}
                                >
                                    Browse Certifications
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Certifications</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCertifications}</div>
                        <p className="text-xs text-muted-foreground">
                            Available to you
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completedCertifications}</div>
                        <p className="text-xs text-muted-foreground">
                            Certifications finished
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <PlayCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgressCertifications}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently learning
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
                            Across completed ones
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Learning Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Learning Activity
                        {activityTotal > 0 && (
                            <Badge variant="secondary">
                                {activityTotal} total activities
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {allActivity.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No activity yet</p>
                                <p className="text-sm mt-2">Start taking quizzes to see your activity here!</p>
                            </div>
                        ) : (
                            <>
                                {allActivity.map((activity: ActivityItem, index: number) => (
                                    <div key={activity.id} className="relative">
                                        {/* Timeline line */}
                                        {index < allActivity.length - 1 && (
                                            <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                                        )}

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="relative">
                                                    {activity.type === 'quiz_attempt' ? (
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </div>
                                                    ) : activity.type === 'progress_update' ? (
                                                        <div className="p-2 bg-blue-100 rounded-full">
                                                            <PlayCircle className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 bg-gray-100 rounded-full">
                                                            <BookOpen className="h-4 w-4 text-gray-600" />
                                                        </div>
                                                    )}

                                                    {/* Timeline dot */}
                                                    <div className="absolute -right-2 top-3 w-3 h-3 bg-background border-2 border-border rounded-full" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{activity.title}</p>
                                                        {activity.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {activity.description}
                                                            </p>
                                                        )}
                                                        {activity.certification_name && (
                                                            <p className="text-sm text-blue-600 mt-1 font-medium">
                                                                📚 {activity.certification_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {new Date(activity.created_at).toLocaleDateString()}
                                                        <br />
                                                        {new Date(activity.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <Badge
                                                        variant={activity.type === 'quiz_attempt' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {activity.type === 'quiz_attempt' ? '✅ Quiz Completed' :
                                                            activity.type === 'progress_update' ? '📝 Progress Update' :
                                                                '📖 Activity'}
                                                    </Badge>

                                                    {activity.score !== null && activity.score !== undefined && (
                                                        <Badge
                                                            variant={activity.score >= 90 ? "default" : activity.score >= 70 ? "secondary" : "destructive"}
                                                            className="text-xs"
                                                        >
                                                            Score: {activity.score}%
                                                        </Badge>
                                                    )}

                                                    {activity.points !== null && activity.points !== undefined && activity.points > 0 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{activity.points} points
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {allActivity.length < activityTotal && (
                                    <div className="text-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={loadMoreActivity}
                                            disabled={loadingActivity}
                                        >
                                            {loadingActivity ? "Loading..." : "Load More Activity"}
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Showing {allActivity.length} of {activityTotal} activities
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Completed Certifications */}
            {userProgress.some(progress => progress.is_completed) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Completed Certifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userProgress
                                .filter(progress => progress.is_completed)
                                .slice(0, 6)
                                .map((progress) => {
                                    const score = progress.total_questions > 0
                                        ? Math.round((progress.correct_answers / progress.total_questions) * 100)
                                        : 0;

                                    return (
                                        <Card key={progress.id} className="border-l-4 border-l-green-500">
                                            <CardContent className="p-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-sm line-clamp-2">
                                                                {progress.certification.name}
                                                            </h4>
                                                            {progress.certification.category && (
                                                                <Badge variant="outline" className="text-xs mt-1">
                                                                    {progress.certification.category.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm">
                                                            <Badge
                                                                variant={score >= 90 ? "default" : score >= 70 ? "secondary" : "destructive"}
                                                                className="text-xs"
                                                            >
                                                                Score: {score}%
                                                            </Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {progress.points} points
                                                        </div>
                                                    </div>

                                                    {score >= 90 && (
                                                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                                            🎓 Teaching Qualified
                                                        </Badge>
                                                    )}

                                                    <div className="text-xs text-muted-foreground">
                                                        Completed {new Date(progress.updated_at).toLocaleDateString()}
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStartCertification(progress.certification.slug)}
                                                        className="w-full h-7 text-xs mt-2"
                                                    >
                                                        Retake Quiz
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}