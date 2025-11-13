"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, GraduationCap, MessageSquare } from "lucide-react";

interface QuizCompletionScreenProps {
    certificationName: string;
    correctAnswers: number;
    totalQuestions: number;
    totalPoints: number;
    onRestart: () => void;
    onShowAI: () => void;
}

const QuizCompletionScreen = memo(function QuizCompletionScreen({
    certificationName,
    correctAnswers,
    totalQuestions,
    totalPoints,
    onRestart,
    onShowAI
}: QuizCompletionScreenProps) {
    console.log('🔄 QuizCompletionScreen component rendering');
    const router = useRouter();

    const getScoreColor = () => {
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const handleBackHome = () => {
        router.push('/');
    };

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
                                onClick={onRestart}
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

            {/* Right side - Explanation Panel for completion */}
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
                                onClick={onShowAI}
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
});

export default QuizCompletionScreen;