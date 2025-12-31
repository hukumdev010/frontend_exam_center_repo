"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { QuestionCard } from "./QuestionCard";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Question } from "../types/quiz";
import CookieManager from "@/lib/cookie-manager";
import {
    QuizCompletionScreen,
    ExplanationPanel,
    GeminiChat,
    EmptyQuizState
} from "@/app/quiz/components";
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

// Memoized wrapper component to prevent unnecessary re-renders
export const ExamQuiz = ({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0, onStatsUpdate }: ExamQuizProps) => {
    console.log('🔄 ExamQuiz wrapper component rendering');
    // Memoize the props to prevent unnecessary re-renders of child component
    const memoizedProps = useMemo(() => ({
        questions,
        certificationName,
        certificationSlug,
        certificationId,
        initialQuestion,
        onStatsUpdate
    }), [questions, certificationName, certificationSlug, certificationId, initialQuestion, onStatsUpdate]);

    return (
        <ExamQuizContent {...memoizedProps} />
    );
};

function ExamQuizContent({ questions, certificationName, certificationSlug, certificationId, initialQuestion = 0, onStatsUpdate }: ExamQuizProps) {
    console.log('🔄 ExamQuizContent component rendering');
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

    // Initialize state from cookies if available, or from user progress if logged in
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
                    const token = CookieManager.getCookie('auth_token');
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
                // Fallback to cookies for non-authenticated users
                const savedState = CookieManager.getCookie(`quiz-${certificationSlug}`);
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

    // Simple functions to show/hide AI assistant
    const showAIFullScreen = useCallback(() => {
        setShowFullScreenAI(true);
    }, []);

    const hideAIFullScreen = useCallback(() => {
        setShowFullScreenAI(false);
    }, []);

    // Handle explanation data changes from QuestionCard
    const handleExplanationChange = useCallback((newExplanationData: {
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
    }, []); // No dependencies needed since we're just calling setExplanationData with the received data

    const saveQuizAttempt = useCallback(async () => {
        if (!session?.user?.id || !certificationId) return;

        try {
            const token = CookieManager.getCookie('auth_token') || 'mock_token';
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
    }, [session?.user?.id, certificationId, score, questions.length, totalPoints]);

    // Save state to cookies for non-authenticated users
    const saveLocalState = useCallback((newScore: number, newAnsweredQuestions: Set<number>, newIsCompleted: boolean, newTotalPoints: number) => {
        if (certificationSlug && !session?.user?.id) {
            CookieManager.setCookie(`quiz-${certificationSlug}`, JSON.stringify({
                score: newScore,
                answeredQuestions: Array.from(newAnsweredQuestions),
                isCompleted: newIsCompleted,
                totalPoints: newTotalPoints
            }), {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: true,
                sameSite: 'Lax',
                path: '/'
            });
        }
    }, [certificationSlug, session?.user?.id]);

    // Save progress to API for authenticated users
    const saveProgress = useCallback(async (questionIndex: number, correctAnswers: number, points: number, completed: boolean) => {
        if (session?.user?.id && certificationId) {
            try {
                const token = CookieManager.getCookie('auth_token') || 'mock_token';
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
    }, [session?.user?.id, certificationId]);

    const correctAnswers = score;
    const totalQuestions = questions.length;

    const handleAnswer = useCallback((isCorrect: boolean, totalPointsFromBackend?: number) => {
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
    }, [answeredQuestions, currentQuestion, score, totalPoints, isCompleted, saveLocalState]);

    const handleSubmit = useCallback((isCorrect: boolean, canProceed: boolean) => {
        setCanProceed(canProceed);
    }, []);

    const handleNext = useCallback(() => {
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
    }, [canProceed, currentQuestion, questions.length, updateURL, saveProgress, score, totalPoints, saveLocalState, answeredQuestions, saveQuizAttempt]);

    const handlePrevious = useCallback(() => {
        if (currentQuestion > 0) {
            const prevQuestion = currentQuestion - 1;
            setCurrentQuestion(prevQuestion);
            updateURL(prevQuestion);
            saveProgress(prevQuestion, score, totalPoints, false);
        }
    }, [currentQuestion, updateURL, saveProgress, score, totalPoints]);

    const handleRestart = useCallback(() => {
        setCurrentQuestion(0);
        setScore(0);
        setSessionScore(0); // Reset session score
        setTotalPoints(0);
        setAnsweredQuestions(new Set());
        setIsCompleted(false);
        setCanProceed(false);

        // Clear saved state
        if (certificationSlug && !session?.user?.id) {
            CookieManager.deleteCookie(`quiz-${certificationSlug}`);
        }

        // Update URL to first question
        updateURL(0);

        // Reset progress in database (restart from first question)
        saveProgress(0, 0, 0, false);
    }, [certificationSlug, session?.user?.id, updateURL, saveProgress]);

    // Memoized handlers to prevent unnecessary re-renders of child components
    const handleShowAIFullScreen = useCallback(() => {
        showAIFullScreen();
    }, [showAIFullScreen]);

    const handleHideAIFullScreen = useCallback(() => {
        hideAIFullScreen();
    }, [hideAIFullScreen]);

    // Memoized current question object to prevent unnecessary re-renders
    const currentQuestionObject = useMemo(() =>
        questions && questions.length > 0 && currentQuestion < questions.length
            ? questions[currentQuestion]
            : null,
        [questions, currentQuestion]
    );

    if (isCompleted) {
        return (
            <QuizCompletionScreen
                certificationName={certificationName}
                correctAnswers={correctAnswers}
                totalQuestions={totalQuestions}
                totalPoints={totalPoints}
                onRestart={handleRestart}
                onShowAI={() => setShowFullScreenAI(true)}
            />
        );
    }

    // Use the EmptyQuizState component for empty states
    if (!questions || questions.length === 0 || currentQuestion >= questions.length) {
        return (
            <EmptyQuizState
                questions={questions}
                questionsLength={questions?.length || 0}
                currentQuestion={currentQuestion}
            />
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
                                question={currentQuestionObject!}
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
                <ExplanationPanel
                    explanationData={explanationData}
                    currentQuestion={currentQuestionObject || {}}
                    onShowAI={handleShowAIFullScreen}
                />
            </div>

            {/* AI Chat Modal */}
            {showFullScreenAI && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-[80vh] w-full max-w-6xl mx-4 bg-white flex flex-col rounded-lg shadow-xl">
                        <GeminiChat
                            currentQuestion={currentQuestionObject?.text}
                            context={certificationName}
                            className="h-full"
                        />
                        {/* Close button overlay */}
                        <button
                            onClick={handleHideAIFullScreen}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-lg p-2 text-white transition-colors"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}
