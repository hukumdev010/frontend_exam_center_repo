"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/quiz";

interface EmptyQuizStateProps {
    questions: Question[] | null;
    questionsLength: number;
    currentQuestion: number;
}

const EmptyQuizState = memo(function EmptyQuizState({
    questions,
    questionsLength,
    currentQuestion
}: EmptyQuizStateProps) {
    console.log('🔄 EmptyQuizState component rendering');
    const router = useRouter();

    const handleBackHome = () => {
        router.push('/');
    };

    // Guard against empty questions array or invalid current question index
    if (!questions || questionsLength === 0 || currentQuestion >= questionsLength) {
        return (
            <div className="p-4 lg:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 lg:p-10 shadow-lg text-center">
                        <div className="text-slate-400 text-6xl mb-6">📚</div>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
                            {!questions || questionsLength === 0
                                ? "No Questions Available"
                                : "Question Not Found"}
                        </h3>
                        <p className="text-slate-600 mb-8">
                            {!questions || questionsLength === 0
                                ? "This certification doesn't have any questions yet. Please check back later or contact support."
                                : "The requested question could not be found. Please try reloading the page."}
                        </p>
                        <Button
                            onClick={handleBackHome}
                            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
});

export default EmptyQuizState;