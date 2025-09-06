"use client"

import { useSession } from "@/lib/useAuth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Target } from "lucide-react"
import { authService } from "@/lib/auth-service"
import { API_ENDPOINTS } from "@/lib/api-config"

interface UserProgress {
    id: string
    currentQuestion: number
    totalQuestions: number
    correctAnswers: number
    points: number
    isCompleted: boolean
    lastActiveAt: string
    certification: {
        id: number
        name: string
        slug: string
        category: {
            name: string
            color?: string
        }
    }
}

interface ProgressDashboardProps {
    onContinueQuiz: (slug: string) => void
}

export function ProgressDashboard({ onContinueQuiz }: ProgressDashboardProps) {
    const { data: session } = useSession()
    const [progress, setProgress] = useState<UserProgress[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.id) {
            // TODO: Uncomment when progress endpoint is ready
            // fetchProgress()
        } else {
            setLoading(false)
        }
    }, [session?.user?.id])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchProgress = async () => {
        console.log('ProgressDashboard: fetchProgress called');
        try {
            const response = await authService.apiCall(API_ENDPOINTS.progress)
            console.log('ProgressDashboard: API response status:', response.status);
            if (response.ok) {
                const data = await response.json()
                console.log('ProgressDashboard: API response data:', data);
                setProgress(data)
            } else {
                console.error('Failed to fetch progress:', response.status, response.statusText)
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!session) {
        return null
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        )
    }

    const inProgressQuizzes = progress.filter(p => !p.isCompleted && p.currentQuestion > 0)
    const completedQuizzes = progress.filter(p => p.isCompleted)

    return (
        <div className="space-y-8">
            {/* Continue In Progress Quizzes */}
            {inProgressQuizzes.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Continue Learning
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {inProgressQuizzes.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.certification.name}</h3>
                                        <p className="text-sm text-gray-600">{item.certification.category.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-blue-600">
                                            {item.currentQuestion} / {item.totalQuestions}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <Progress
                                        value={(item.currentQuestion / item.totalQuestions) * 100}
                                        className="h-2"
                                    />
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Target className="w-4 h-4" />
                                            {item.correctAnswers} correct
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Trophy className="w-4 h-4" />
                                            {item.points} pts
                                        </span>
                                    </div>

                                    <Button
                                        onClick={() => onContinueQuiz(item.certification.slug)}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Quizzes */}
            {completedQuizzes.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-green-600" />
                        Completed
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedQuizzes.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-gray-900 text-sm">{item.certification.name}</h3>
                                        <p className="text-xs text-gray-600">{item.certification.category.name}</p>
                                    </div>
                                    <div className="text-green-600">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>{item.correctAnswers}/{item.totalQuestions} correct</span>
                                    <span>{item.points} pts</span>
                                </div>

                                <div className="mt-2">
                                    <Progress
                                        value={(item.correctAnswers / item.totalQuestions) * 100}
                                        className="h-1"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Start New Quiz - Removed since certificates are shown directly on home page */}
        </div>
    )
}
