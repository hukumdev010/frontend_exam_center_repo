"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { QuestionCard } from "./QuestionCard";
import { Button } from "./ui/button";
import { RotateCcw, Trophy, GraduationCap, Maximize2, X } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";
import { AIAssistantProvider } from "./AIAssistantContext";
import { AIAssistantPanel } from "./AIAssistantPanel";

type Answer = {
    id: number;
    text: string;
    isCorrect: boolean;
};

type Question = {
    id: number;
    text: string;
    explanation?: string;
    points: number;
    answers: Answer[];
};

interface ExamQuizProps {
    questions: Question[];
    certificationName: string;
    certificationSlug?: string;
    certificationId?: number;
    initialQuestion?: number;
    onStatsUpdate?: (stats: { sessionScore: number; totalPoints: number; progress: number; currentQuestion: number; totalQuestions: number }) => void;
}

export function ExamQuiz({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0, onStatsUpdate }: ExamQuizProps) {
    return (
        <AIAssistantProvider>
            <ExamQuizContent
                questions={questions}
                certificationName={certificationName}
                certificationSlug={certificationSlug}
                certificationId={certificationId}
                initialQuestion={initialQuestion}
                onStatsUpdate={onStatsUpdate}
            />
        </AIAssistantProvider>
    );
}

function ExamQuizContent({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0, onStatsUpdate }: ExamQuizProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
    const [score, setScore] = useState(0);
    const [sessionScore, setSessionScore] = useState(0); // Live session score
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [isCompleted, setIsCompleted] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [showFullScreenAI, setShowFullScreenAI] = useState(false);

    // Initialize state from localStorage if available, or from user progress if logged in
    useEffect(() => {
        // Reset session score when component mounts
        setSessionScore(0);
        setCanProceed(false);

        if (certificationSlug) {
            // Fallback to localStorage for non-authenticated users
            const savedState = localStorage.getItem(`quiz-${certificationSlug}`);
            if (savedState) {
                const state = JSON.parse(savedState);
                setScore(state.score || 0);
                setAnsweredQuestions(new Set(state.answeredQuestions || []));
                setIsCompleted(state.isCompleted || false);
                setTotalPoints(state.totalPoints || 0);
            }
        }
    }, [certificationSlug, certificationId, session?.user?.id]);

    // Update parent component with current stats
    useEffect(() => {
        if (onStatsUpdate) {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            onStatsUpdate({
                sessionScore,
                totalPoints,
                progress,
                currentQuestion: currentQuestion + 1,
                totalQuestions: questions.length
            });
        }
    }, [sessionScore, totalPoints, currentQuestion, questions.length, onStatsUpdate]);

    // Reset state when question changes
    useEffect(() => {
        setCanProceed(false);
    }, [currentQuestion]);

    const saveQuizAttempt = async () => {
        if (!session?.user?.id || !certificationId) return;

        try {
            const token = localStorage.getItem('auth_token') || 'mock_token';
            await fetch(API_ENDPOINTS.quizAttempts, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    certificationId,
                    score: Math.round((score / questions.length) * 100),
                    totalQuestions: questions.length,
                    correctAnswers: score,
                    points: totalPoints
                })
            });
        } catch (error) {
            console.error('Failed to save quiz attempt:', error);
        }
    };

    // Update URL when question changes
    const updateURL = (questionIndex: number) => {
        if (certificationSlug) {
            router.replace(`/quiz/${certificationSlug}?q=${questionIndex}`, { scroll: false });
        }
    };

    // Save state to localStorage for non-authenticated users
    const saveLocalState = (newScore: number, newAnsweredQuestions: Set<number>, newIsCompleted: boolean, newTotalPoints: number) => {
        if (certificationSlug && !session?.user?.id) {
            localStorage.setItem(`quiz-${certificationSlug}`, JSON.stringify({
                score: newScore,
                answeredQuestions: Array.from(newAnsweredQuestions),
                isCompleted: newIsCompleted,
                totalPoints: newTotalPoints
            }));
        }
    };

    // Save progress to API for authenticated users
    const saveProgress = async (questionIndex: number, correctAnswers: number, points: number, completed: boolean) => {
        if (session?.user?.id && certificationId) {
            try {
                const token = localStorage.getItem('auth_token') || 'mock_token';
                await fetch(API_ENDPOINTS.progress, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        certificationId,
                        currentQuestion: questionIndex,
                        correctAnswers,
                        points,
                        isCompleted: completed
                    })
                });
            } catch (error) {
                console.error('Failed to save user progress:', error);
            }
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const correctAnswers = score;
    const totalQuestions = questions.length;

    const handleAnswer = (isCorrect: boolean, points: number) => {
        if (answeredQuestions.has(currentQuestion)) return;

        const newAnsweredQuestions = new Set(answeredQuestions).add(currentQuestion);
        const newScore = isCorrect ? score + 1 : score;
        const newTotalPoints = isCorrect ? totalPoints + points : totalPoints;

        // Update session score (live scoring)
        if (isCorrect) {
            setSessionScore(prev => prev + 1);
        }

        setAnsweredQuestions(newAnsweredQuestions);
        setScore(newScore);
        setTotalPoints(newTotalPoints);

        // Save state
        saveLocalState(newScore, newAnsweredQuestions, isCompleted, newTotalPoints);
        saveProgress(currentQuestion, newScore, newTotalPoints, isCompleted);
    };

    const handleSubmit = (isCorrect: boolean, canProceed: boolean) => {
        setCanProceed(canProceed);
    };

    const handleNext = () => {
        if (!canProceed) return; // Only proceed if current question is correct

        if (currentQuestion < questions.length - 1) {
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
            setCanProceed(false); // Reset for next question
            updateURL(nextQuestion);
            saveProgress(nextQuestion, score, totalPoints, false);
        } else {
            const newIsCompleted = true;
            setIsCompleted(newIsCompleted);
            saveLocalState(score, answeredQuestions, newIsCompleted, totalPoints);
            saveProgress(currentQuestion, score, totalPoints, newIsCompleted);
            saveQuizAttempt();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            const prevQuestion = currentQuestion - 1;
            setCurrentQuestion(prevQuestion);
            updateURL(prevQuestion);
            saveProgress(prevQuestion, score, totalPoints, false);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSessionScore(0); // Reset session score
        setTotalPoints(0);
        setAnsweredQuestions(new Set());
        setIsCompleted(false);
        setCanProceed(false);

        // Clear saved state
        if (certificationSlug && !session?.user?.id) {
            localStorage.removeItem(`quiz-${certificationSlug}`);
        }

        // Update URL to first question
        updateURL(0);

        // Reset progress in database
        saveProgress(0, 0, 0, false);
    };

    const getScoreColor = () => {
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const handleBackHome = () => {
        router.push('/');
    };

    if (isCompleted) {
        return (
            <AIAssistantProvider>
                <div className="flex flex-col lg:flex-row min-h-[80vh]">
                    {/* Left side - Completion screen */}
                    <div className="flex-1 p-6 lg:p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 lg:p-12 shadow-lg text-center">
                                <div className="mb-6">
                                    <div className="bg-yellow-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                                        <Trophy className="w-10 h-10 text-yellow-600" />
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">🎉 Quiz Completed!</h2>
                                    <p className="text-lg text-slate-700 mb-6">{certificationName}</p>
                                </div>

                                {/* Results Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                        <div className="text-3xl font-bold mb-2">
                                            <span className={getScoreColor()}>
                                                {correctAnswers}/{totalQuestions}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Questions Correct</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                        <div className="text-3xl font-bold mb-2">
                                            <span className={getScoreColor()}>
                                                {Math.round((correctAnswers / totalQuestions) * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Score Percentage</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                        <div className="text-3xl font-bold mb-2 text-purple-600">
                                            {totalPoints}
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Total Points</p>
                                    </div>
                                </div>

                                {/* Performance Message */}
                                <div className="mb-8">
                                    {((correctAnswers / totalQuestions) * 100) >= 80 ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <p className="text-green-800 font-semibold">🌟 Excellent Performance!</p>
                                            <p className="text-green-700 text-sm mt-1">You have a strong understanding of this topic.</p>
                                        </div>
                                    ) : ((correctAnswers / totalQuestions) * 100) >= 60 ? (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="text-yellow-800 font-semibold">👍 Good Work!</p>
                                            <p className="text-yellow-700 text-sm mt-1">You&apos;re on the right track. Review the concepts you missed.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-blue-800 font-semibold">📚 Keep Learning!</p>
                                            <p className="text-blue-700 text-sm mt-1">Practice makes perfect. Review the material and try again.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={handleRestart}
                                        variant="outline"
                                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-200"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Restart Quiz
                                    </Button>
                                    <Button
                                        onClick={handleBackHome}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - AI Assistant */}
                    <div className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-slate-200/50 bg-gradient-to-b from-purple-50/50 to-pink-50/50 flex-shrink-0">
                        <div className="sticky top-0 h-96 lg:h-[80vh] flex flex-col">
                            <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 rounded-lg p-2">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">AI Study Assistant</h3>
                                            <p className="text-sm text-purple-100">Review & Learn More</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFullScreenAI(true)}
                                        className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-lg"
                                        title="Expand to full screen"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-sm text-purple-100 mt-2">
                                    Quiz completed! Use AI assistance to review concepts.
                                </p>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <AIAssistantPanel />
                            </div>
                        </div>
                    </div>
                </div>
            </AIAssistantProvider>
        );
    }

    // Guard against empty questions array or invalid current question index
    if (!questions || questions.length === 0 || currentQuestion >= questions.length) {
        return (
            <div className="p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-lg text-center">
                        <div className="text-slate-400 text-6xl mb-6">📚</div>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
                            {!questions || questions.length === 0
                                ? "No Questions Available"
                                : "Question Not Found"}
                        </h3>
                        <p className="text-slate-600 mb-8">
                            {!questions || questions.length === 0
                                ? "This certification doesn't have any questions yet. Please check back later or contact support."
                                : "The requested question could not be found. Please try reloading the page."}
                        </p>
                        <Button
                            onClick={handleBackHome}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row min-h-[80vh]">
                {/* Left side - Quiz */}
                <div className="flex-1 p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">


                        {/* Question Card */}
                        <div className="mb-6">
                            <QuestionCard
                                question={questions[currentQuestion]}
                                onAnswer={handleAnswer}
                                onSubmit={handleSubmit}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                canProceed={canProceed}
                                isFirstQuestion={currentQuestion === 0}
                                isLastQuestion={currentQuestion === questions.length - 1}
                                currentQuestion={currentQuestion}
                                totalQuestions={questions.length}
                            />
                        </div>
                    </div>
                </div>

                {/* Right side - AI Assistant */}
                <div className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-slate-200/50 bg-gradient-to-b from-purple-50/50 to-pink-50/50 flex-shrink-0">
                    <div className="sticky top-0 h-96 lg:h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">AI Study Assistant</h3>
                                        <p className="text-sm text-purple-100">Your learning companion</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFullScreenAI(true)}
                                    className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-lg transition-all duration-200"
                                    title="Expand to full screen"
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>
                            <p className="text-sm text-purple-100 mt-2">
                                Click &quot;Ask AI Assistant&quot; on any question for help
                            </p>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            <AIAssistantPanel />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen AI Assistant Modal */}
            {showFullScreenAI && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                    <div className="h-full w-full bg-white flex flex-col">
                        {/* Full Screen Header */}
                        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 rounded-lg p-3">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">AI Study Assistant</h2>
                                        <p className="text-sm text-purple-100 mt-1">
                                            Full screen mode - Get comprehensive study help
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFullScreenAI(false)}
                                    className="text-white hover:bg-white/20 h-12 w-12 p-0 rounded-lg"
                                    title="Close full screen"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Full Screen Content */}
                        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-purple-50/30 to-pink-50/30">
                            <div className="max-w-4xl mx-auto">
                                <AIAssistantPanel />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
