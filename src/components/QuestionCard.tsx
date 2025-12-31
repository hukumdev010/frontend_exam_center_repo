"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Question, Answer } from "../types/quiz";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { deterministicShuffle } from "@/lib/shuffle-utils";
import CookieManager from "@/lib/cookie-manager";

// Import highlight.js styles
import 'highlight.js/styles/github.css';

interface QuestionCardProps {
    question?: Question;
    onAnswer: (isCorrect: boolean, totalPoints?: number) => void;
    onSubmit: (isCorrect: boolean, canProceed: boolean) => void;
    // Navigation props
    onNext?: () => void;
    onPrevious?: () => void;
    onReset?: () => void;
    canProceed?: boolean;
    isFirstQuestion?: boolean;
    isLastQuestion?: boolean;
    // Explanation props
    onExplanationChange?: (explanationData: {
        showExplanation: boolean;
        hasSubmitted: boolean;
        isAnswerCorrect: boolean;
        attempts: number;
        maxAttempts: number;
        earnedPoints: number;
        explanation?: string;
    }) => void;
}

export function QuestionCard({
    question,
    onAnswer,
    onSubmit,
    onNext,
    onPrevious,
    onReset,
    canProceed = false,
    isFirstQuestion = false,
    isLastQuestion = false,
    onExplanationChange
}: QuestionCardProps) {
    console.log('🔄 QuestionCard component rendering');
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts] = useState(3); // Allow up to 3 attempts
    const [randomizedAnswers, setRandomizedAnswers] = useState<Answer[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset component state when question changes
    useEffect(() => {
        if (!question) return;

        // Use deterministic shuffle based on question ID to avoid hydration mismatch
        // This ensures the same order on both server and client
        const seedString = `question-${question.id}-${question.text.substring(0, 20)}`;
        setRandomizedAnswers(deterministicShuffle(question.answers, seedString));

        setSelectedAnswer(null);
        setHasSubmitted(false);
        setEarnedPoints(0);
        setIsAnswerCorrect(false);
        setCorrectAnswerId(null);
        setAttempts(0);
        setIsSubmitting(false);

        // Reset explanation state in parent
        if (onExplanationChange) {
            onExplanationChange({
                showExplanation: false,
                hasSubmitted: false,
                isAnswerCorrect: false,
                attempts: 0,
                maxAttempts,
                earnedPoints: 0,
                explanation: question?.explanation
            });
        }
    }, [question, onExplanationChange, maxAttempts]);

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
                <div className="relative p-4 md:p-6">
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
            const urlPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const certificationSlug = urlPath.split('/').pop() || 'aws-cloud-practitioner';

            // Call the verification API
            const token = CookieManager.getCookie('auth_token');
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
                // Note: showExplanation is managed by parent component
            }

            // Notify parent of explanation state change
            if (onExplanationChange) {
                onExplanationChange({
                    showExplanation: !!result.explanation,
                    hasSubmitted: true,
                    isAnswerCorrect: result.is_correct,
                    attempts: attempts + 1,
                    maxAttempts,
                    earnedPoints: result.points_earned,
                    explanation: question?.explanation
                });
            }

            onAnswer(result.is_correct, result.total_points);
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

            // Notify parent of error state
            if (onExplanationChange) {
                onExplanationChange({
                    showExplanation: false,
                    hasSubmitted: true,
                    isAnswerCorrect: false,
                    attempts: attempts + 1,
                    maxAttempts,
                    earnedPoints: 0,
                    explanation: question?.explanation
                });
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
        setIsSubmitting(false);
        setCorrectAnswerId(null);

        // Reset explanation state in parent
        if (onExplanationChange) {
            onExplanationChange({
                showExplanation: false,
                hasSubmitted: false,
                isAnswerCorrect: false,
                attempts,
                maxAttempts,
                earnedPoints,
                explanation: question?.explanation
            });
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
                    <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold rounded-2xl border border-blue-200/50 shadow-sm">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                            <span>Question</span>
                            <div className="h-4 w-px bg-blue-300/50"></div>
                            <span className="text-blue-700">
                                {question.points > 1 ? `${question.points} points` : `${question.points} point`}
                            </span>
                        </div>

                        {/* Reset Button */}
                        {onReset && (
                            <Button
                                onClick={onReset}
                                variant="outline"
                                size="sm"
                                className="inline-flex items-center gap-2 bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                                title="Reset Quiz - Start over from question 1"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Quiz
                            </Button>
                        )}
                    </div>
                    <div className="prose prose-slate max-w-none">
                        {(() => {
                            try {
                                // Log the question text for debugging
                                console.log('Rendering question text:', question.text);

                                // Clean the question text to remove any potential problematic content
                                const cleanText = question.text
                                    ?.replace(/<t\b[^>]*>.*?<\/t>/gi, '') // Remove <t> tags
                                    ?.replace(/<t\b[^>]*>/gi, '') // Remove unclosed <t> tags
                                    ?.replace(/<\/t>/gi, '') // Remove orphaned closing </t> tags
                                    ?.replace(/\{t\}/g, '') // Remove {t} expressions
                                    ?.replace(/\{t\([^}]*\)\}/g, '') // Remove {t()} function calls
                                    ?.replace(/\bt\b/g, '') // Remove standalone 't' that might be treated as JSX
                                    || '';

                                return (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            // Headers
                                            h1: ({ ...props }) => <h1 className="text-2xl font-bold text-slate-900 mb-4" {...props} />,
                                            h2: ({ ...props }) => <h2 className="text-xl font-bold text-slate-900 mb-3" {...props} />,
                                            h3: ({ ...props }) => <h3 className="text-lg font-semibold text-slate-800 mb-2" {...props} />,
                                            h4: ({ ...props }) => <h4 className="text-base font-semibold text-slate-800 mb-2" {...props} />,

                                            // Paragraphs and text
                                            p: ({ ...props }) => <p className="text-slate-700 mb-3 leading-relaxed" {...props} />,
                                            strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                            em: ({ ...props }) => <em className="italic text-slate-700" {...props} />,

                                            // Code blocks
                                            pre: ({ ...props }) => (
                                                <div className="relative">
                                                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto border shadow-lg" {...props} />
                                                </div>
                                            ),
                                            code: ({ className, children, ...props }) => {
                                                const isInline = !className;
                                                if (isInline) {
                                                    return <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
                                                }
                                                return <code className={className} {...props}>{children}</code>;
                                            },

                                            // Lists
                                            ul: ({ ...props }) => <ul className="list-disc list-inside text-slate-700 mb-3 space-y-1" {...props} />,
                                            ol: ({ ...props }) => <ol className="list-decimal list-inside text-slate-700 mb-3 space-y-1" {...props} />,
                                            li: ({ ...props }) => <li className="text-slate-700" {...props} />,

                                            // Tables
                                            table: ({ ...props }) => (
                                                <div className="overflow-x-auto mb-4">
                                                    <table className="min-w-full border border-slate-200 rounded-lg" {...props} />
                                                </div>
                                            ),
                                            thead: ({ ...props }) => <thead className="bg-slate-50" {...props} />,
                                            th: ({ ...props }) => <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-900" {...props} />,
                                            td: ({ ...props }) => <td className="border border-slate-200 px-3 py-2 text-slate-700" {...props} />,

                                            // Blockquotes
                                            blockquote: ({ ...props }) => (
                                                <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 text-blue-900 rounded-r-lg mb-3" {...props} />
                                            ),

                                            // Links
                                            a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,

                                            // Horizontal rule
                                            hr: ({ ...props }) => <hr className="border-slate-300 my-6" {...props} />,
                                        }}
                                    >
                                        {cleanText}
                                    </ReactMarkdown>
                                );
                            } catch (error) {
                                console.error('Error rendering question text:', error, question.text);
                                // Fallback to plain text rendering
                                return <div className="text-slate-700">{question.text}</div>;
                            }
                        })()}
                    </div>
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
                                <div className="prose prose-sm max-w-none">
                                    {(() => {
                                        try {
                                            // Clean the answer text to remove any potential problematic content
                                            const cleanAnswerText = answer.text
                                                ?.replace(/<t\b[^>]*>.*?<\/t>/gi, '') // Remove <t> tags
                                                ?.replace(/<t\b[^>]*>/gi, '') // Remove unclosed <t> tags
                                                ?.replace(/<\/t>/gi, '') // Remove orphaned closing </t> tags
                                                ?.replace(/\{t\}/g, '') // Remove {t} expressions
                                                ?.replace(/\{t\([^}]*\)\}/g, '') // Remove {t()} function calls
                                                ?.replace(/\bt\b/g, '') // Remove standalone 't' that might be treated as JSX
                                                || '';

                                            return (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeHighlight]}
                                                    components={{
                                                        // Keep it simple for answer options
                                                        p: ({ ...props }) => <span className="text-sm font-medium leading-relaxed" {...props} />,
                                                        strong: ({ ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                                                        em: ({ ...props }) => <em className="italic" {...props} />,
                                                        code: ({ ...props }) => <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                                                        // Remove margins for inline elements in answers
                                                        h1: ({ ...props }) => <span className="font-bold text-lg" {...props} />,
                                                        h2: ({ ...props }) => <span className="font-bold text-base" {...props} />,
                                                        h3: ({ ...props }) => <span className="font-bold text-sm" {...props} />,
                                                        ul: ({ ...props }) => <span {...props} />,
                                                        ol: ({ ...props }) => <span {...props} />,
                                                        li: ({ ...props }) => <span {...props} />,
                                                    }}
                                                >
                                                    {cleanAnswerText}
                                                </ReactMarkdown>
                                            );
                                        } catch (error) {
                                            console.error('Error rendering answer text:', error, answer.text);
                                            // Fallback to plain text rendering
                                            return <span className="text-sm font-medium leading-relaxed">{answer.text}</span>;
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {getAnswerIcon(answer)}
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10 opacity-0 group-hover/answer:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    ))}
                </div>

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

                {/* Navigation Section */}
                {(onNext || onPrevious) && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            disabled={isFirstQuestion || !onPrevious}
                            className="bg-white/80 hover:bg-white border-slate-200"
                        >
                            Previous
                        </Button>

                        {/* Submit Answer Button */}
                        {!hasSubmitted ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null || isSubmitting || (hasSubmitted && isAnswerCorrect)}
                                className={cn(
                                    "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                                    selectedAnswer !== null && !isSubmitting && "ring-2 ring-blue-200 ring-offset-1"
                                )}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isSubmitting ? 'Verifying...' : 'Submit Answer'}
                                    <CheckCircle2 className="w-4 h-4" />
                                </span>
                            </Button>
                        ) : (
                            <Button
                                disabled
                                className="bg-slate-200 text-slate-400 cursor-not-allowed px-6 py-2 rounded-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Submitted
                                    <CheckCircle2 className="w-4 h-4" />
                                </span>
                            </Button>
                        )}

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


            </div>
        </div>
    );
}
