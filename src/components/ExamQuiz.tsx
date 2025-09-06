"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { QuestionCard } from "./QuestionCard";
import { Progress } from "./ui/progress";
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
}

export function ExamQuiz({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0 }: ExamQuizProps) {
    return (
        <AIAssistantProvider>
            <ExamQuizContent
                questions={questions}
                certificationName={certificationName}
                certificationSlug={certificationSlug}
                certificationId={certificationId}
                initialQuestion={initialQuestion}
            />
        </AIAssistantProvider>
    );
}

function ExamQuizContent({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0 }: ExamQuizProps) {
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
                <div className="flex flex-col lg:flex-row min-h-screen gap-6">
                    {/* Left side - Completion screen */}
                    <div className="flex-1">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg border border-slate-200 p-6 lg:p-8 shadow-sm text-center">
                                <Trophy className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-yellow-500" />
                                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                                <p className="text-slate-600 mb-6">{certificationName}</p>

                                <div className="bg-slate-50 rounded-lg p-4 lg:p-6 mb-6">
                                    <div className="text-2xl lg:text-3xl font-bold mb-2">
                                        <span className={getScoreColor()}>
                                            {correctAnswers}/{totalQuestions}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 mb-2">
                                        You scored {Math.round((correctAnswers / totalQuestions) * 100)}%
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Total Points: {totalPoints}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button onClick={handleRestart} variant="outline" className="inline-flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4" />
                                        Restart Quiz
                                    </Button>
                                    <Button onClick={handleBackHome} className="bg-blue-600 hover:bg-blue-700">
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - AI Assistant */}
                    <div className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 flex-shrink-0">
                        <div className="sticky top-0 h-96 lg:h-screen flex flex-col">
                            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5" />
                                        <h3 className="font-semibold">AI Study Assistant</h3>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFullScreenAI(true)}
                                        className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                        title="Expand to full screen"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-purple-100 mt-1">
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
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-slate-200 p-6 lg:p-8 shadow-sm text-center">
                    <div className="text-slate-600 mb-4">
                        {!questions || questions.length === 0
                            ? "No questions available for this quiz."
                            : "Question not found."}
                    </div>
                    <Button onClick={handleBackHome} className="bg-blue-600 hover:bg-blue-700">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row min-h-screen gap-6">
                {/* Left side - Quiz */}
                <div className="flex-1">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">{certificationName}</h1>
                                <div className="text-sm text-slate-600">
                                    Question {currentQuestion + 1} of {questions.length}
                                </div>
                            </div>
                            <Progress value={progress} className="w-full" />

                            {/* Live Session Stats */}
                            <div className="mt-2 text-center">
                                <span className="text-sm text-green-600 font-medium">
                                    Session Correct: {sessionScore}
                                </span>
                                <span className="text-sm text-slate-500 mx-2">|</span>
                                <span className="text-sm text-slate-600">
                                    Total Points: {totalPoints}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <QuestionCard
                                question={questions[currentQuestion]}
                                onAnswer={handleAnswer}
                                onSubmit={handleSubmit}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>

                            <div className="text-sm text-slate-600 text-center flex-1 mx-4">
                                <span className="font-medium">
                                    {canProceed ? "Ready to proceed!" : "Submit your answer to continue"}
                                </span>
                            </div>

                            {canProceed ? (
                                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                                </Button>
                            ) : (
                                <Button disabled className="bg-slate-300">
                                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side - AI Assistant */}
                <div className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 flex-shrink-0">
                    <div className="sticky top-0 h-96 lg:h-screen flex flex-col">
                        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5" />
                                    <h3 className="font-semibold">AI Study Assistant</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFullScreenAI(true)}
                                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                    title="Expand to full screen"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-purple-100 mt-1">
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
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-6 h-6" />
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
                                    className="text-white hover:bg-white/20 h-10 w-10 p-0"
                                    title="Close full screen"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Full Screen Content */}
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
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
