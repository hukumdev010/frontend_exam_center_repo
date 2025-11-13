"use client";

import React, { memo } from "react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { GraduationCap, Info, ExternalLink, MessageSquare } from "lucide-react";

interface ExplanationPanelProps {
    explanationData: {
        showExplanation: boolean;
        hasSubmitted: boolean;
        isAnswerCorrect: boolean;
        attempts: number;
        maxAttempts: number;
        earnedPoints: number;
        explanation: string;
    };
    currentQuestion: {
        reference?: string;
        text?: string;
    };
    onShowAI: () => void;
}

const ExplanationPanel = memo(function ExplanationPanel({
    explanationData,
    currentQuestion,
    onShowAI
}: ExplanationPanelProps) {
    console.log('🔄 ExplanationPanel component rendering');
    const shouldShowExplanation = explanationData.showExplanation &&
        explanationData.explanation &&
        explanationData.hasSubmitted &&
        (explanationData.isAnswerCorrect || explanationData.attempts >= explanationData.maxAttempts);

    const renderExplanation = () => {
        try {
            // Clean the explanation text to remove any potential problematic content
            const cleanExplanation = explanationData.explanation
                ?.replace(/<t\b[^>]*>.*?<\/t>/gi, '') // Remove <t> tags
                ?.replace(/<t\b[^>]*>/gi, '') // Remove unclosed <t> tags
                ?.replace(/<\/t>/gi, '') // Remove orphaned closing </t> tags
                ?.replace(/\{t\}/g, '') // Remove {t} expressions
                ?.replace(/\{t\([^}]*\)\}/g, '') // Remove {t()} function calls
                ?.replace(/\bt\b/g, '') // Remove standalone 't' that might be treated as JSX
                ?.replace(/&lt;t&gt;/gi, '') // Remove HTML encoded <t> tags
                ?.replace(/&lt;\/t&gt;/gi, '') // Remove HTML encoded </t> tags
                || '';

            return (
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
                    {cleanExplanation}
                </ReactMarkdown>
            );
        } catch (error) {
            console.error('Error rendering explanation:', error, explanationData.explanation);
            // Fallback to plain text rendering
            return <div className="text-slate-700">{explanationData.explanation}</div>;
        }
    };

    return (
        <div className="w-full lg:w-[600px] border-t lg:border-t-0 lg:border-l border-slate-200/50 bg-linear-to-b from-blue-50/50 to-purple-50/50 shrink-0">
            <div className="sticky top-0 h-96 lg:h-screen flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 bg-linear-to-r from-blue-600 to-purple-600 text-white">
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
                            onClick={onShowAI}
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
                    {shouldShowExplanation ? (
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
                                    {renderExplanation()}
                                </div>

                                {/* Reference Link if available */}
                                {currentQuestion?.reference && (
                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                        <a
                                            href={currentQuestion.reference}
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
    );
});

export default ExplanationPanel;