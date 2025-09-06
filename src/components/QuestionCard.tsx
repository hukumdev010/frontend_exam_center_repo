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
    onAnswer: (isCorrect: boolean, points: number) => void;
    onSubmit: (isCorrect: boolean, canProceed: boolean) => void;
}

export function QuestionCard({ question, onAnswer, onSubmit }: QuestionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts] = useState(3); // Allow up to 3 attempts

    // AI Assistant context
    const { showLoading, showResponse } = useAIAssistant();

    // Reset component state when question changes
    useEffect(() => {
        if (!question) return;
        setSelectedAnswer(null);
        setShowExplanation(false);
        setHasSubmitted(false);
        setEarnedPoints(0);
        setIsAnswerCorrect(false);
        setAttempts(0);
    }, [question]);

    // Return loading state if question is not available
    if (!question) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-slate-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-10 bg-slate-200 rounded"></div>
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

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        const selectedAnswerObj = question.answers.find(a => a.id === selectedAnswer);
        if (!selectedAnswerObj) return;

        setHasSubmitted(true);
        setAttempts(prev => prev + 1);

        const points = selectedAnswerObj.isCorrect ? question.points : 0;
        setEarnedPoints(points);
        setIsAnswerCorrect(selectedAnswerObj.isCorrect);

        // Only show explanation if answer is correct
        if (selectedAnswerObj.isCorrect) {
            setShowExplanation(true);
        }

        onAnswer(selectedAnswerObj.isCorrect, points);
        onSubmit(selectedAnswerObj.isCorrect, selectedAnswerObj.isCorrect || attempts >= maxAttempts);
    };

    const handleTryAgain = () => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
        setShowExplanation(false);
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
                return "bg-blue-50 border-blue-300 text-blue-800";
            }
            return "hover:bg-slate-50 border-slate-200";
        }

        // Only show styling for the selected answer and correct styling when correct answer was selected
        if (selectedAnswer === answer.id) {
            return answer.isCorrect
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800";
        }

        // Only highlight correct answers if the user got it right OR exceeded max attempts
        if (answer.isCorrect && (isAnswerCorrect || attempts >= maxAttempts)) {
            return "bg-green-50 border-green-300 text-green-800";
        }

        return "hover:bg-slate-50 border-slate-200";
    };

    const getAnswerIcon = (answer: Answer) => {
        if (!hasSubmitted) return null;

        // Only show correct answer icon if user got it right OR exceeded max attempts
        if (answer.isCorrect && (isAnswerCorrect || attempts >= maxAttempts)) {
            return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        }

        // Show X only for the selected wrong answer
        if (selectedAnswer === answer.id && !answer.isCorrect) {
            return <XCircle className="w-5 h-5 text-red-600" />;
        }

        return null;
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-900 leading-relaxed">
                    {question.text}
                </h3>
            </div>

            <div className="space-y-3 mb-6">
                {question.answers.map((answer) => (
                    <button
                        key={answer.id}
                        className={cn(
                            "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between group",
                            getAnswerStyle(answer),
                            !hasSubmitted && "hover:border-slate-300"
                        )}
                        onClick={() => handleAnswerSelect(answer.id)}
                        disabled={hasSubmitted && isAnswerCorrect} // Only disable if correct answer was submitted
                    >
                        <span className="text-sm font-medium">{answer.text}</span>
                        {getAnswerIcon(answer)}
                    </button>
                ))}
            </div>

            {/* Submit button or Try Again button */}
            {!hasSubmitted && (
                <div className="mb-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Submit Answer
                    </Button>
                </div>
            )}

            {hasSubmitted && !isAnswerCorrect && attempts < maxAttempts && (
                <div className="mb-6">
                    <Button
                        onClick={handleTryAgain}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                        Try Again ({maxAttempts - attempts} attempts left)
                    </Button>
                </div>
            )}

            {hasSubmitted && (!isAnswerCorrect && attempts >= maxAttempts) && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 text-center">
                        Maximum attempts reached. The correct answer is now shown.
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    onClick={() => setShowExplanation(!showExplanation)}
                    disabled={!hasSubmitted || (!isAnswerCorrect && attempts < maxAttempts)}
                >
                    <Info className="w-4 h-4" />
                    {showExplanation ? "Hide" : "Show"} Explanation
                </button>

                {hasSubmitted && (
                    <div className="text-sm font-medium">
                        {earnedPoints > 0 ? (
                            <span className="text-green-600">+{earnedPoints} point{earnedPoints > 1 ? 's' : ''}</span>
                        ) : (
                            <span className="text-red-600">0 points</span>
                        )}
                    </div>
                )}
            </div>

            {showExplanation && question.explanation && hasSubmitted && (isAnswerCorrect || attempts >= maxAttempts) && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 leading-relaxed">
                        <strong>Explanation:</strong> {question.explanation}
                    </p>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-3">
                            {question.reference && (
                                <a
                                    href={question.reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Learn more
                                </a>
                            )}
                            <button
                                onClick={handleAskChatGPT}
                                className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Ask AI Assistant
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
