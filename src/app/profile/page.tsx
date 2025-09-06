"use client"

import { useSession } from "@/lib/useAuth"
import { useEffect, useState } from "react"
import { AuthButton } from "@/components/AuthButtonWrapper"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Clock, BookOpen, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/api-config"
import { authService } from "@/lib/auth-service"

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

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [progress, setProgress] = useState<UserProgress[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.id) {
            // fetchData()
        } else {
            setLoading(false)
        }
    }, []) // eslint-disable-line

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
                    <p className="text-gray-600 mb-6">Please sign in to view your profile and progress.</p>
                    <AuthButton />
                </div>
            </div>
        )
    }

    const totalPoints = progress.reduce((sum, p) => sum + p.points, 0)
    const completedQuizzes = progress.filter(p => p.isCompleted).length
    const inProgressQuizzes = progress.filter(p => !p.isCompleted && p.currentQuestion > 0).length
    const totalCorrectAnswers = progress.reduce((sum, p) => sum + p.correctAnswers, 0)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                        <p className="text-gray-600">Track your learning progress and achievements</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                        <AuthButton />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Points</p>
                                <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
                            </div>
                            <Trophy className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{completedQuizzes}</p>
                            </div>
                            <Award className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-orange-600">{inProgressQuizzes}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Correct Answers</p>
                                <p className="text-2xl font-bold text-purple-600">{totalCorrectAnswers}</p>
                            </div>
                            <Target className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* In Progress Quizzes */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            In Progress
                        </h2>
                        {inProgressQuizzes > 0 ? (
                            <div className="space-y-4">
                                {progress.filter(p => !p.isCompleted && p.currentQuestion > 0).map((item) => (
                                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.certification.name}</h3>
                                                <p className="text-sm text-gray-600">{item.certification.category.name}</p>
                                            </div>
                                            <span className="text-sm font-medium text-blue-600">
                                                {item.currentQuestion} / {item.totalQuestions}
                                            </span>
                                        </div>
                                        <Progress value={(item.currentQuestion / item.totalQuestions) * 100} className="mb-2" />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{item.correctAnswers} correct</span>
                                            <span>{item.points} points</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No quizzes in progress</p>
                                <Link href="/">
                                    <Button className="mt-3">Start a Quiz</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Completed Quizzes */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            Completed
                        </h2>
                        {completedQuizzes > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {progress.filter(p => p.isCompleted).map((item) => (
                                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.certification.name}</h3>
                                                <p className="text-sm text-gray-600">{item.certification.category.name}</p>
                                            </div>
                                            <div className="text-green-600">
                                                <Trophy className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Score: {Math.round((item.correctAnswers / item.totalQuestions) * 100)}%</span>
                                            <span>{item.points} points</span>
                                        </div>
                                        <Progress
                                            value={(item.correctAnswers / item.totalQuestions) * 100}
                                            className="mt-2 h-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No completed quizzes yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
