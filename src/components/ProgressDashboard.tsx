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
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm h-32">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                        <div className="relative p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2 mb-4"></div>
                                <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
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
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                            <Clock className="w-7 h-7 text-blue-600" />
                        </div>
                        Continue Learning
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {inProgressQuizzes.map((item) => (
                            <div key={item.id} className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                                <div className="relative p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.certification.name}</h3>
                                            <p className="text-sm text-slate-600 font-medium px-3 py-1 bg-slate-100 rounded-full inline-block">{item.certification.category.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600">
                                                {item.currentQuestion} / {item.totalQuestions}
                                            </div>
                                            <div className="text-xs text-slate-500">questions</div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <Progress
                                            value={(item.currentQuestion / item.totalQuestions) * 100}
                                            className="h-3 bg-slate-200"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>{Math.round((item.currentQuestion / item.totalQuestions) * 100)}% complete</span>
                                            <span>{item.totalQuestions - item.currentQuestion} remaining</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-6 text-sm">
                                            <span className="flex items-center gap-2 text-green-600 font-medium">
                                                <div className="p-1 bg-green-100 rounded-lg">
                                                    <Target className="w-4 h-4" />
                                                </div>
                                                {item.correctAnswers} correct
                                            </span>
                                            <span className="flex items-center gap-2 text-amber-600 font-medium">
                                                <div className="p-1 bg-amber-100 rounded-lg">
                                                    <Trophy className="w-4 h-4" />
                                                </div>
                                                {item.points} pts
                                            </span>
                                        </div>

                                        <Button
                                            onClick={() => onContinueQuiz(item.certification.slug)}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Quizzes */}
            {completedQuizzes.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                            <Trophy className="w-7 h-7 text-green-600" />
                        </div>
                        Completed
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedQuizzes.map((item) => (
                            <div key={item.id} className="relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                                <div className="relative p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 text-base mb-1">{item.certification.name}</h3>
                                            <p className="text-xs text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded-full inline-block">{item.certification.category.name}</p>
                                        </div>
                                        <div className="p-2 bg-green-100 rounded-xl">
                                            <Trophy className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm font-medium mb-3">
                                        <span className="text-green-600">{item.correctAnswers}/{item.totalQuestions} correct</span>
                                        <span className="text-amber-600">{item.points} pts</span>
                                    </div>

                                    <div>
                                        <Progress
                                            value={(item.correctAnswers / item.totalQuestions) * 100}
                                            className="h-2 bg-slate-200"
                                        />
                                        <div className="text-xs text-slate-500 mt-1 text-center">
                                            {Math.round((item.correctAnswers / item.totalQuestions) * 100)}% accuracy
                                        </div>
                                    </div>
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
