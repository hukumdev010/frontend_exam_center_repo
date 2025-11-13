"use client";

import { useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ExamQuiz } from "@/components/ExamQuiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Clock, Target, BookOpen } from "lucide-react";
import { useSession } from "@/lib/useAuth";
import Header from "@/components/Header";
import { useCertificationQuizData } from "@/hooks/useApi";

function QuizPageContent() {
    console.log('🔄 QuizPageContent component rendering');
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const [quizStats, setQuizStats] = useState({
        sessionScore: 0,
        totalPoints: 0,
        progress: 0,
        currentQuestion: 1,
        totalQuestions: 0
    });

    const certificationSlug = params.certification as string;
    // Convert 1-based URL parameter to 0-based array index
    // URL uses q=1 for first question, but array index should be 0
    const urlQuestionParam = parseInt(searchParams.get('q') || '1');
    const currentQuestion = Math.max(0, urlQuestionParam - 1);

    // Use SWR hook for quiz data fetching
    const { data: certificationData, isLoading: loading, error } = useCertificationQuizData(certificationSlug);

    const handleBackToHome = () => {
        router.push('/');
    };

    // Memoize the stats update callback to prevent unnecessary re-renders
    const handleStatsUpdate = useCallback((stats: {
        sessionScore: number;
        totalPoints: number;
        progress: number;
        currentQuestion: number;
        totalQuestions: number;
    }) => {
        setQuizStats(stats);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Header />
                <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mb-4"></div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Certification</h3>
                            <p className="text-slate-600">Please wait while we prepare your quiz...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100/50 shadow-sm">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white h-9 px-3"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
                                <p className="text-red-700 mb-6">{error?.message || 'An error occurred while loading the quiz.'}</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleBackToHome}
                                        className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!certificationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Header />
                <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                                <div className="text-slate-400 text-4xl mb-4">📚</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Questions Available</h3>
                                <p className="text-slate-600 mb-6">This certification doesn&apos;t have any questions yet.</p>
                                <Button
                                    onClick={handleBackToHome}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Browse Other Certifications
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header
                showQuizStats={!!session?.user}
                quizStats={{
                    correct: quizStats.sessionScore,
                    total: quizStats.totalPoints,
                    currentQuestion: quizStats.currentQuestion,
                    totalQuestions: quizStats.totalQuestions,
                    score: Math.round(quizStats.progress)
                }}
                customContent={
                    <div className="hidden sm:flex lg:hidden items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{certificationData.questions_count} Questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{certificationData.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span className="capitalize">{certificationData.level}</span>
                        </div>
                    </div>
                }
            />

            {/* Main Content Container */}
            <div className="max-w-[1800px] mx-auto p-2 sm:p-4">
                {/* Certification Info Panel - Mobile */}
                <div className="md:hidden mb-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">{certificationData.name}</h1>
                                <p className="text-xs text-slate-600">Certification Quiz</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-blue-50 rounded-lg p-2">
                                <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                <p className="text-xs text-slate-600">Questions</p>
                                <p className="text-sm font-semibold text-slate-900">{certificationData.questions_count}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                                <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                                <p className="text-xs text-slate-600">Duration</p>
                                <p className="text-sm font-semibold text-slate-900">{certificationData.duration} min</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-2">
                                <Target className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                <p className="text-xs text-slate-600">Level</p>
                                <p className="text-sm font-semibold text-slate-900 capitalize">{certificationData.level}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl overflow-hidden">
                    <ExamQuiz
                        questions={certificationData.questions}
                        certificationName={certificationData.name}
                        certificationSlug={certificationSlug}
                        certificationId={certificationData.id}
                        initialQuestion={currentQuestion}
                        onStatsUpdate={handleStatsUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

export default function QuizPage() {
    console.log('🔄 QuizPage component rendering');
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Quiz</h3>
                        <p className="text-slate-600">Preparing your certification exam...</p>
                    </div>
                </div>
            </div>
        }>
            <QuizPageContent />
        </Suspense>
    );
}
