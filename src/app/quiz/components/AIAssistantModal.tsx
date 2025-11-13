"use client";

import React, { memo } from "react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { GraduationCap, X } from "lucide-react";

interface AIAssistantModalProps {
    isOpen: boolean;
    question: string;
    response: string;
    onClose: () => void;
}

const AIAssistantModal = memo(function AIAssistantModal({
    isOpen,
    question,
    response,
    onClose
}: AIAssistantModalProps) {
    console.log('🔄 AIAssistantModal component rendering');
    if (!isOpen) return null;

    const renderAIResponse = () => {
        try {
            // Clean the AI response to remove any potential problematic content
            const cleanAiResponse = (response || "")
                .replace(/<t\b[^>]*>.*?<\/t>/gi, '') // Remove <t> tags
                .replace(/<t\b[^>]*>/gi, '') // Remove unclosed <t> tags
                .replace(/<\/t>/gi, '') // Remove orphaned closing </t> tags
                .replace(/\{t\}/g, '') // Remove {t} expressions
                .replace(/\{t\([^}]*\)\}/g, '') // Remove {t()} function calls
                .replace(/\bt\b/g, ''); // Remove standalone 't' that might be treated as JSX

            return (
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
                    {cleanAiResponse}
                </ReactMarkdown>
            );
        } catch (error) {
            console.error('Error rendering AI response:', error, response);
            // Fallback to plain text rendering
            return <div className="text-slate-700">{response || ""}</div>;
        }
    };

    return (
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
                        onClick={onClose}
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
                            <div className="text-slate-700 text-base">{question}</div>
                        </div>

                        {/* AI Response - Maximum Space */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex-1">
                            <h4 className="font-medium text-slate-800 mb-2 text-sm uppercase tracking-wide">AI Explanation:</h4>
                            <div className="prose prose-sm max-w-none text-slate-700">
                                {response === "Loading AI assistance..." ? (
                                    <div className="flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                                        <span>Getting AI explanation...</span>
                                    </div>
                                ) : (
                                    renderAIResponse()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AIAssistantModal;