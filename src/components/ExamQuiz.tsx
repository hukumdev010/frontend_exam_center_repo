"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { QuestionCard } from "./QuestionCard";
import { Button } from "./ui/button";
import { RotateCcw, Trophy, GraduationCap, X, MessageSquare, Info, ExternalLink } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Question } from "../types/quiz";
import ReactMarkdown from 'react-markdown';
// import { CodeEditor } from "./CodeEditor";


// Removed complex AI Assistant context - now using simple callbacks

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
        <ExamQuizContent
            questions={questions}
            certificationName={certificationName}
            certificationSlug={certificationSlug}
            certificationId={certificationId}
            initialQuestion={initialQuestion}
            onStatsUpdate={onStatsUpdate}
        />
    );
}

function ExamQuizContent({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0, onStatsUpdate }: ExamQuizProps) {
    const router = useRouter();
    const { data: session } = useSession();
    // Remove unused AI assistant context
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
    const [score, setScore] = useState(0);
    const [sessionScore, setSessionScore] = useState(0); // Live session score
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [isCompleted, setIsCompleted] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [showFullScreenAI, setShowFullScreenAI] = useState(false);

    // Explanation state for right panel
    const [explanationData, setExplanationData] = useState({
        showExplanation: false,
        hasSubmitted: false,
        isAnswerCorrect: false,
        attempts: 0,
        maxAttempts: 3,
        earnedPoints: 0,
        explanation: ''
    });



    // Update URL when question changes
    // Convert 0-based array index to 1-based URL parameter
    const updateURL = useCallback((questionIndex: number) => {
        if (certificationSlug) {
            const urlQuestionNumber = questionIndex + 1;
            router.replace(`/quiz/${certificationSlug}?q=${urlQuestionNumber}`, { scroll: false });
        }
    }, [certificationSlug, router]);

    // Initialize state from localStorage if available, or from user progress if logged in
    useEffect(() => {
        // Reset session score when component mounts - use functional updates
        const timer = setTimeout(() => {
            setSessionScore(0);
            setCanProceed(false);
        }, 0);

        const initializeQuizState = async () => {
            if (session?.user?.id && certificationId) {
                // Fetch user progress from backend for logged-in users
                try {
                    const token = localStorage.getItem('auth_token');
                    const response = await fetch(API_ENDPOINTS.progress, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const progressData = await response.json();
                        // Find progress for current certification
                        const currentCertProgress = progressData.find((p: { certification: { id: number } }) => p.certification.id === certificationId);

                        if (currentCertProgress) {
                            setScore(currentCertProgress.correct_answers || 0);
                            setSessionScore(currentCertProgress.correct_answers || 0);
                            setTotalPoints(currentCertProgress.points || 0);
                            setIsCompleted(currentCertProgress.is_completed || false);

                            // Resume from saved progress (current_question is 1-based in backend)
                            // Convert 1-based backend value to 0-based frontend array index
                            const backendCurrentQuestion = currentCertProgress.current_question || 1;
                            const savedQuestionIndex = Math.max(0, backendCurrentQuestion - 1);
                            setCurrentQuestion(savedQuestionIndex);

                            // Update URL to reflect the correct question
                            updateURL(savedQuestionIndex);

                            // Note: We don't set answeredQuestions from backend as it's session-based
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch user progress:', error);
                }
            } else if (certificationSlug) {
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
        };

        initializeQuizState();

        return () => clearTimeout(timer);
    }, [certificationSlug, certificationId, session?.user?.id, updateURL]);

    // Update parent component with current stats - simple function
    const updateStats = useCallback(() => {
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
    }, [onStatsUpdate, sessionScore, totalPoints, currentQuestion, questions.length]);

    // Call updateStats whenever relevant values change
    useEffect(() => {
        updateStats();
    }, [updateStats]);

    // Reset state when question changes
    useEffect(() => {
        // Use a timeout to avoid setState during render
        const timer = setTimeout(() => setCanProceed(false), 0);
        return () => clearTimeout(timer);
    }, [currentQuestion]);

    // AI assistant state for full screen
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');

    // Simple functions to show/hide AI assistant
    const showAIFullScreen = (question: string, response?: string) => {
        setAiQuestion(question);
        setAiResponse(response || '');
        setShowFullScreenAI(true);
    };

    const hideAIFullScreen = () => {
        setShowFullScreenAI(false);
        setAiQuestion('');
        setAiResponse('');
    };

    // Handle explanation data changes from QuestionCard
    const handleExplanationChange = (newExplanationData: {
        showExplanation: boolean;
        hasSubmitted: boolean;
        isAnswerCorrect: boolean;
        attempts: number;
        maxAttempts: number;
        earnedPoints: number;
        explanation?: string;
    }) => {
        setExplanationData({
            ...newExplanationData,
            explanation: newExplanationData.explanation || ''
        });
    };

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
                    certification_id: certificationId,
                    score: Math.round((score / questions.length) * 100),
                    total_questions: questions.length,
                    correct_answers: score,
                    points: totalPoints
                })
            });
        } catch (error) {
            console.error('Failed to save quiz attempt:', error);
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
                // Convert 0-based frontend array index to 1-based backend question number
                const backendQuestionNumber = questionIndex + 1;
                await fetch(API_ENDPOINTS.progress, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        certification_id: certificationId,
                        current_question: backendQuestionNumber,
                        correct_answers: correctAnswers,
                        points,
                        is_completed: completed
                    })
                });
            } catch (error) {
                console.error('Failed to save user progress:', error);
            }
        }
    };

    const correctAnswers = score;
    const totalQuestions = questions.length;

    const handleAnswer = (isCorrect: boolean, totalPointsFromBackend?: number) => {
        if (answeredQuestions.has(currentQuestion)) return;

        const newAnsweredQuestions = new Set(answeredQuestions).add(currentQuestion);
        const newScore = isCorrect ? score + 1 : score;

        // Update session score (live scoring)
        if (isCorrect) {
            setSessionScore(prev => prev + 1);
        }

        // Update total points from backend if available (for logged-in users)
        if (totalPointsFromBackend !== undefined) {
            setTotalPoints(totalPointsFromBackend);
        }

        setAnsweredQuestions(newAnsweredQuestions);
        setScore(newScore);

        // Save state with updated points
        const updatedTotalPoints = totalPointsFromBackend !== undefined ? totalPointsFromBackend : totalPoints;
        saveLocalState(newScore, newAnsweredQuestions, isCompleted, updatedTotalPoints);
        // Don't save progress here since the verify-answer API handles it
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

        // Reset progress in database (restart from first question)
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
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left side - Completion screen */}
                <div className="flex-1 p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 lg:p-10 shadow-lg text-center">
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

                {/* Right side - Explanation Panel */}
                <div className="w-full lg:w-[600px] border-t lg:border-t-0 lg:border-l border-slate-200/50 bg-gradient-to-b from-blue-50/50 to-purple-50/50 flex-shrink-0">
                    <div className="sticky top-0 h-96 lg:h-screen flex flex-col">
                        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Quiz Complete!</h3>
                                        <p className="text-sm text-blue-100">Review & Learn More</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-blue-100 mt-2">
                                Quiz completed! Great job on finishing all questions.
                            </p>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="text-center text-slate-500 mt-20">
                                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                <p className="text-lg font-medium mb-2">Quiz Complete!</p>
                                <p className="text-sm mb-4">
                                    Review your answers or start a new quiz.
                                </p>
                                <Button
                                    onClick={() => setShowFullScreenAI(true)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Chat with AI
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    // Guard against empty questions array or invalid current question index
    if (!questions || questions.length === 0 || currentQuestion >= questions.length) {
        return (
            <div className="p-4 lg:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 lg:p-10 shadow-lg text-center">
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
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left side - Quiz */}
                <div className="flex-1 p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto">


                        {/* Question Card */}
                        <div className="mb-6">
                            <QuestionCard
                                question={questions[currentQuestion]}
                                onAnswer={handleAnswer}
                                onSubmit={handleSubmit}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                onReset={handleRestart}
                                canProceed={canProceed}
                                isFirstQuestion={currentQuestion === 0}
                                isLastQuestion={currentQuestion === questions.length - 1}
                                onExplanationChange={handleExplanationChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Right side - Explanation Panel */}
                <div className="w-full lg:w-[600px] border-t lg:border-t-0 lg:border-l border-slate-200/50 bg-gradient-to-b from-blue-50/50 to-purple-50/50 flex-shrink-0">
                    <div className="sticky top-0 h-96 lg:h-screen flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Study Panel</h3>
                                        <p className="text-sm text-blue-100">Question explanations & AI help</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => showAIFullScreen(questions[currentQuestion]?.text || "", "Ask me anything about this question!")}
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 px-3 py-1.5 text-xs"
                                >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Chat with AI
                                </Button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {explanationData.showExplanation && explanationData.explanation && explanationData.hasSubmitted && (explanationData.isAnswerCorrect || explanationData.attempts >= explanationData.maxAttempts) ? (
                                <div className="space-y-4 h-[50vh] lg:h-[70vh]">
                                    {/* Explanation Content */}
                                    <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm h-full overflow-y-auto">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <Info className="w-3 h-3 text-white" />
                                            </div>
                                            <h4 className="text-lg font-bold text-blue-900">Explanation</h4>
                                        </div>

                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ ...props }) => <p className="mb-3 text-slate-700 leading-relaxed" {...props} />,
                                                    ul: ({ ...props }) => <ul className="list-disc ml-6 mb-3 space-y-1 text-slate-700" {...props} />,
                                                    ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-3 space-y-1 text-slate-700" {...props} />,
                                                    li: ({ ...props }) => <li className="text-slate-700" {...props} />,
                                                    strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                                    code: ({ ...props }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800" {...props} />,
                                                }}
                                            >
                                                {explanationData.explanation}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Reference Link if available */}
                                        {questions[currentQuestion]?.reference && (
                                            <div className="mt-4 pt-4 border-t border-blue-200">
                                                <a
                                                    href={questions[currentQuestion].reference}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-md font-medium text-sm"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Learn more
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center text-slate-500">
                                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                    <p className="text-lg font-medium mb-2">Explanation Panel</p>
                                    <p className="text-sm mb-4">
                                        Answer the question to see the explanation here.
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Use the Chat with AI button above for immediate help.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Full Screen AI Assistant Modal */}
            {showFullScreenAI && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-[80vh] w-full max-w-6xl mx-4 bg-white flex flex-col rounded-lg shadow-xl">
                        {/* Sticky Minimal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-slate-200 bg-white shadow-sm flex-shrink-0 rounded-t-lg">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg font-semibold text-slate-900">AI Study Assistant</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={hideAIFullScreen}
                                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-8 w-8 p-0 rounded-md"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Maximized Content Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 min-h-0">
                            <div className="max-w-5xl mx-auto space-y-4">
                                {/* Compact Question */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                    <h4 className="font-medium text-slate-800 mb-2 text-sm uppercase tracking-wide">Question:</h4>
                                    <div className="text-slate-700 text-base">{aiQuestion}</div>
                                </div>

                                {/* AI Response - Maximum Space */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex-1">
                                    <h4 className="font-medium text-slate-800 mb-2 text-sm uppercase tracking-wide">AI Explanation:</h4>
                                    <div className="prose prose-sm max-w-none text-slate-700">
                                        {aiResponse === "Loading AI assistance..." ? (
                                            <div className="flex items-center gap-3">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                                                <span>Getting AI explanation...</span>
                                            </div>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    // Custom styling for markdown elements
                                                    h1: ({ ...props }) => <h1 className="text-xl font-bold mb-3 text-slate-900" {...props} />,
                                                    h2: ({ ...props }) => <h2 className="text-lg font-semibold mb-2 text-slate-800" {...props} />,
                                                    h3: ({ ...props }) => <h3 className="text-base font-semibold mb-2 text-slate-800" {...props} />,
                                                    p: ({ ...props }) => <p className="mb-3 text-slate-700 leading-relaxed" {...props} />,
                                                    ul: ({ ...props }) => <ul className="list-disc ml-6 mb-3 space-y-1 text-slate-700" {...props} />,
                                                    ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-3 space-y-1 text-slate-700" {...props} />,
                                                    li: ({ ...props }) => <li className="text-slate-700" {...props} />,
                                                    code: ({ ...props }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800" {...props} />,
                                                    pre: ({ ...props }) => <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto mb-3 border" {...props} />,
                                                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-purple-300 pl-4 italic text-slate-600 mb-3 bg-purple-50 py-2 rounded-r" {...props} />,
                                                    strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                                    em: ({ ...props }) => <em className="italic text-slate-700" {...props} />,
                                                    a: ({ ...props }) => <a className="text-purple-600 hover:text-purple-800 underline" {...props} />,
                                                    hr: ({ ...props }) => <hr className="my-6 border-slate-200" {...props} />
                                                }}
                                            >
                                                {aiResponse || ""}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
