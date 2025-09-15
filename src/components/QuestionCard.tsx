"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Info, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { API_ENDPOINTS } from "@/lib/api-config";
import { useAIAssistant } from "./AIAssistantContext";

type Answer = {
    id: number;
    text: string;
    question_id: number;
    isCorrect: boolean;
};

type Question = {
    id: number;
    text: string;
    explanation?: string;
    reference?: string;
    points: number;
    answers: Answer[];
};

interface QuestionCardProps {
    question?: Question;
    onAnswer: (isCorrect: boolean) => void;
    onSubmit: (isCorrect: boolean, canProceed: boolean) => void;
    // Navigation props
    onNext?: () => void;
    onPrevious?: () => void;
    canProceed?: boolean;
    isFirstQuestion?: boolean;
    isLastQuestion?: boolean;
    currentQuestion?: number;
    totalQuestions?: number;
}

export function QuestionCard({
    question,
    onAnswer,
    onSubmit,
    onNext,
    onPrevious,
    canProceed = false,
    isFirstQuestion = false,
    isLastQuestion = false,
    currentQuestion,
    totalQuestions
}: QuestionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts] = useState(3); // Allow up to 3 attempts
    const [randomizedAnswers, setRandomizedAnswers] = useState<Answer[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Assistant context
    const { showLoading, showResponse } = useAIAssistant();

    // Shuffle array function - Fisher-Yates shuffle algorithm
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];

        // Fisher-Yates shuffle algorithm for better randomization
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Ensure the order actually changed for debugging

        return shuffled;
    };

    // Reset component state when question changes
    useEffect(() => {
        if (!question) return;

        // Randomize answers order
        setRandomizedAnswers(shuffleArray(question.answers));

        setSelectedAnswer(null);
        setShowExplanation(false);
        setHasSubmitted(false);
        setEarnedPoints(0);
        setIsAnswerCorrect(false);
        setCorrectAnswerId(null);
        setAttempts(0);
        setIsSubmitting(false);
    }, [question]);

    // Return loading state if question is not available
    if (!question) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl border border-slate-200/60 shadow-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-indigo-500/5"></div>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                <div className="relative p-6 md:p-8">
                    <div className="animate-pulse space-y-4">
                        {/* Question header skeleton */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full"></div>
                            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-32"></div>
                        </div>

                        {/* Question text skeleton */}
                        <div className="space-y-3 mb-6">
                            <div className="h-7 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-full"></div>
                            <div className="h-7 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-4/5"></div>
                            <div className="h-7 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/5"></div>
                        </div>

                        {/* Answer options skeleton */}
                        <div className="space-y-3 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative">
                                    <div className="h-14 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent rounded-2xl animate-shimmer"></div>
                                </div>
                            ))}
                        </div>

                        {/* Submit button skeleton */}
                        <div className="h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    const handleAnswerSelect = (answerId: number) => {
        if (hasSubmitted && isAnswerCorrect) return; // Don't allow changes if correct answer was submitted
        setSelectedAnswer(answerId);
        if (hasSubmitted) {
            setHasSubmitted(false); // Allow resubmission
        }
    };

    const handleSubmit = async () => {
        if (selectedAnswer === null || isSubmitting) return;

        setIsSubmitting(true);
        setAttempts(prev => prev + 1);

        try {
            // Get the certification slug from the URL or pass it as a prop
            const urlPath = window.location.pathname;
            const certificationSlug = urlPath.split('/').pop() || 'aws-cloud-practitioner';

            // Call the verification API
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_ENDPOINTS.base}/api/certifications/${certificationSlug}/verify-answer`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    question_id: question.id,
                    answer_id: selectedAnswer
                })
            });

            if (!response.ok) {
                throw new Error('Failed to verify answer');
            }

            const result = await response.json();

            // Only now set hasSubmitted to true (after API verification)
            setHasSubmitted(true);
            setIsAnswerCorrect(result.is_correct);
            setEarnedPoints(result.points_earned);

            // After API verification, find and set the correct answer ID from the question data
            const correctAnswer = question.answers.find(answer => answer.isCorrect);
            if (correctAnswer) {
                setCorrectAnswerId(correctAnswer.id);
            }

            // Show explanation regardless of correctness
            if (result.explanation) {
                setShowExplanation(true);
            }

            onAnswer(result.is_correct);
            onSubmit(result.is_correct, result.is_correct || attempts >= maxAttempts);

        } catch (error) {
            console.error('Error verifying answer:', error);
            // Fallback to client-side verification (shouldn't happen)
            setHasSubmitted(true);
            setIsAnswerCorrect(false);
            setEarnedPoints(0);

            // Still set the correct answer ID for fallback
            const correctAnswer = question.answers.find(answer => answer.isCorrect);
            if (correctAnswer) {
                setCorrectAnswerId(correctAnswer.id);
            }

            onAnswer(false);
            onSubmit(false, attempts >= maxAttempts);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTryAgain = () => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsSubmitting(false);
        setCorrectAnswerId(null);
    };

    const handleAskChatGPT = async () => {
        if (!question) return;

        showLoading(question.text);

        try {
            const token = localStorage.getItem('auth_token') || 'mock_token';

            const requestBody = {
                message: `Help me understand this question without giving the direct answer: ${question.text}`,
                context: `Question about certification exam`,
                current_question: question.text,
                conversation_history: []
            };

            const response = await fetch(API_ENDPOINTS.ai.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showResponse(question.text, data.response || "I'm sorry, I couldn't generate a response.");

        } catch (error) {
            console.error('Error calling AI API:', error);
            showResponse(question.text, "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.");
        }
    };

    const getAnswerStyle = (answer: Answer) => {
        if (!hasSubmitted) {
            if (selectedAnswer === answer.id) {
                return "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 border-blue-400 text-blue-900 shadow-lg ring-2 ring-blue-200 transform scale-[1.02]";
            }
            return "bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-700 hover:from-slate-50 hover:to-blue-50 hover:border-blue-200 hover:shadow-md";
        }

        // After submission, show results
        if (selectedAnswer === answer.id) {
            // Show selected answer styling
            return isAnswerCorrect
                ? "bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-50 border-emerald-400 text-emerald-900 shadow-lg ring-2 ring-emerald-200"
                : "bg-gradient-to-br from-red-50 via-rose-100 to-red-50 border-red-400 text-red-900 shadow-lg ring-2 ring-red-200";
        }

        // If the user selected a wrong answer, highlight the correct answer
        if (!isAnswerCorrect && correctAnswerId === answer.id) {
            return "bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-50 border-emerald-400 text-emerald-900 shadow-lg ring-2 ring-emerald-200";
        }

        return "bg-gradient-to-br from-slate-50 to-white border-slate-200 text-slate-600 opacity-70";
    };

    const getAnswerIcon = (answer: Answer) => {
        if (!hasSubmitted) return null;

        // Show checkmark for selected correct answer
        if (selectedAnswer === answer.id && isAnswerCorrect) {
            return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        }

        // Show X for selected wrong answer
        if (selectedAnswer === answer.id && !isAnswerCorrect) {
            return <XCircle className="w-5 h-5 text-red-600" />;
        }

        // Show checkmark for the correct answer when user selected wrong
        if (!isAnswerCorrect && correctAnswerId === answer.id) {
            return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        }

        return null;
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl border border-slate-200/60 shadow-xl backdrop-blur-sm group">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-indigo-500/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 delay-150"></div>

            <div className="relative p-6 md:p-8">
                {/* Question Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold rounded-2xl mb-4 border border-blue-200/50 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                        <span>Question</span>
                        <div className="h-4 w-px bg-blue-300/50"></div>
                        <span className="text-blue-700">
                            {question.points > 1 ? `${question.points} points` : `${question.points} point`}
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed tracking-tight">
                        {question.text}
                    </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mb-6">
                    {randomizedAnswers.map((answer, index) => (
                        <button
                            key={answer.id}
                            className={cn(
                                "w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group/answer relative overflow-hidden",
                                getAnswerStyle(answer),
                                !hasSubmitted && "hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1 active:scale-[0.98]",
                                hasSubmitted && isAnswerCorrect && "cursor-default"
                            )}
                            onClick={() => handleAnswerSelect(answer.id)}
                            disabled={hasSubmitted && isAnswerCorrect}
                        >
                            <div className="flex items-start gap-3 relative z-10">
                                <div className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold transition-all duration-300",
                                    selectedAnswer === answer.id && !hasSubmitted
                                        ? "bg-blue-500 text-white shadow-lg"
                                        : "bg-slate-200 text-slate-600 group-hover/answer:bg-blue-100 group-hover/answer:text-blue-700"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="text-sm font-medium leading-relaxed flex-1">{answer.text}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {getAnswerIcon(answer)}
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 opacity-0 group-hover/answer:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    ))}
                </div>

                {/* Submit button or Try Again button */}
                {!hasSubmitted && (
                    <div className="mb-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null || isSubmitting}
                            className={cn(
                                "w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base",
                                selectedAnswer !== null && !isSubmitting && "ring-2 ring-blue-200 ring-offset-2"
                            )}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isSubmitting ? 'Verifying...' : 'Submit Answer'}
                                <CheckCircle2 className="w-4 h-4" />
                            </span>
                        </Button>
                    </div>
                )}

                {hasSubmitted && !isAnswerCorrect && attempts < maxAttempts && (
                    <div className="mb-6">
                        <Button
                            onClick={handleTryAgain}
                            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-base"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Try Again
                                <span className="px-2 py-1 bg-white/20 rounded-lg text-sm font-semibold">
                                    {maxAttempts - attempts} left
                                </span>
                            </span>
                        </Button>
                    </div>
                )}

                {hasSubmitted && (!isAnswerCorrect && attempts >= maxAttempts) && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-red-900 font-semibold text-sm">Maximum attempts reached</p>
                                <p className="text-red-700 text-sm">The correct answer is now highlighted above.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer with controls and scoring */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                    <button
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-300",
                            (!hasSubmitted || (!isAnswerCorrect && attempts < maxAttempts))
                                ? "text-slate-400 cursor-not-allowed bg-slate-100"
                                : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 bg-slate-50"
                        )}
                        onClick={() => setShowExplanation(!showExplanation)}
                        disabled={!hasSubmitted || (!isAnswerCorrect && attempts < maxAttempts)}
                    >
                        <Info className="w-3 h-3" />
                        {showExplanation ? "Hide" : "Show"} Explanation
                    </button>

                    {hasSubmitted && (
                        <div className="text-xs font-bold">
                            {earnedPoints > 0 ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-sm border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>+{earnedPoints} point{earnedPoints > 1 ? 's' : ''}</span>
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 rounded-xl shadow-sm border border-red-200">
                                    <XCircle className="w-3 h-3" />
                                    <span>0 points</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Section */}
                {(onNext || onPrevious) && (
                    <div className="mt-6 flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            disabled={isFirstQuestion || !onPrevious}
                            className="bg-white/80 hover:bg-white border-slate-200"
                        >
                            Previous
                        </Button>

                        <div className="text-sm text-slate-600 text-center flex-1 mx-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${canProceed
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${canProceed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                <span className="font-medium">
                                    {canProceed ? "Ready to proceed!" : "Submit your answer to continue"}
                                </span>
                            </div>
                        </div>

                        {canProceed && onNext ? (
                            <Button
                                onClick={onNext}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                            >
                                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                            </Button>
                        ) : (
                            <Button
                                disabled
                                className="bg-slate-200 text-slate-400 cursor-not-allowed"
                            >
                                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                            </Button>
                        )}
                    </div>
                )}

                {/* Enhanced Explanation Section */}
                {showExplanation && question.explanation && hasSubmitted && (isAnswerCorrect || attempts >= maxAttempts) && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl shadow-lg relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl"></div>

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Info className="w-3 h-3 text-white" />
                                </div>
                                <h4 className="text-base font-bold text-blue-900">Explanation</h4>
                            </div>

                            <p className="text-blue-900 leading-relaxed mb-4 text-sm">
                                {question.explanation}
                            </p>

                            <div className="pt-4 border-t border-blue-200/50">
                                <div className="flex flex-wrap items-center gap-3">
                                    {question.reference && (
                                        <a
                                            href={question.reference}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white text-blue-600 hover:text-blue-800 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-md font-medium text-xs"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Learn more
                                        </a>
                                    )}
                                    <button
                                        onClick={handleAskChatGPT}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:shadow-md font-medium text-xs transform hover:-translate-y-0.5"
                                    >
                                        <MessageSquare className="w-3 h-3" />
                                        Ask AI Assistant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
