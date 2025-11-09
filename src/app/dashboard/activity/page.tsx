"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, PlayCircle, BookOpen, Clock } from "lucide-react";
import { learningService, UserActivity } from "@/services/learning";

export default function ActivityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState<UserActivity | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        const loadActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                const activityData = await learningService.getUserActivity(limit);
                setActivity(activityData);
            } catch (error) {
                console.error("Error loading activity:", error);
                setError("Failed to load activity data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
    }, [limit]);

    const handleRetry = async () => {
        try {
            setLoading(true);
            setError(null);

            const activityData = await learningService.getUserActivity(limit);
            setActivity(activityData);
        } catch (error) {
            console.error("Error loading activity:", error);
            setError("Failed to load activity data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setLimit(prevLimit => prevLimit + 20);
    };

    const goBack = () => {
        router.back();
    };

    if (loading && !activity) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-sm text-muted-foreground">Loading activity...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card className="border-red-200">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={handleRetry}
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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Learning
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Learning Activity</h1>
                    <p className="text-muted-foreground">Your complete learning history</p>
                </div>
            </div>

            {/* Activity Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                        {activity && (
                            <Badge variant="secondary">
                                {activity.total_count} total activities
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {!activity || activity.activities.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No activity yet</p>
                                <p className="text-sm mt-2">Start taking quizzes to see your activity here!</p>
                            </div>
                        ) : (
                            <>
                                {activity.activities.map((activityItem, index) => (
                                    <div key={activityItem.id} className="relative">
                                        {/* Timeline line */}
                                        {index < activity.activities.length - 1 && (
                                            <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                                        )}

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="relative">
                                                    {activityItem.type === 'quiz_attempt' ? (
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </div>
                                                    ) : activityItem.type === 'progress_update' ? (
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
                                                        <p className="font-medium text-sm">{activityItem.title}</p>
                                                        {activityItem.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {activityItem.description}
                                                            </p>
                                                        )}
                                                        {activityItem.certification_name && (
                                                            <p className="text-sm text-blue-600 mt-1 font-medium">
                                                                📚 {activityItem.certification_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {new Date(activityItem.created_at).toLocaleDateString()}
                                                        <br />
                                                        {new Date(activityItem.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <Badge
                                                        variant={activityItem.type === 'quiz_attempt' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {activityItem.type === 'quiz_attempt' ? '✅ Quiz Completed' :
                                                            activityItem.type === 'progress_update' ? '📝 Progress Update' :
                                                                '📖 Activity'}
                                                    </Badge>

                                                    {activityItem.score !== null && activityItem.score !== undefined && (
                                                        <Badge
                                                            variant={activityItem.score >= 90 ? "default" : activityItem.score >= 70 ? "secondary" : "destructive"}
                                                            className="text-xs"
                                                        >
                                                            Score: {activityItem.score}%
                                                        </Badge>
                                                    )}

                                                    {activityItem.points !== null && activityItem.points !== undefined && activityItem.points > 0 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{activityItem.points} points
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {activity.activities.length < activity.total_count && (
                                    <div className="text-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={loadMore}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Load More Activity"}
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Showing {activity.activities.length} of {activity.total_count} activities
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}