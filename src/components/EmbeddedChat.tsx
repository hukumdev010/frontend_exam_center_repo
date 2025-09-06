"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { MessageSquare, X, ExternalLink, Bot, Copy, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmbeddedChatProps {
    currentQuestion?: string;
    context?: string;
}

export function EmbeddedChat({ currentQuestion, context }: EmbeddedChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(label);
            setTimeout(() => setCopiedText(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const openChatGPTWithPrompt = (prompt: string) => {
        const encodedPrompt = encodeURIComponent(prompt);
        const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
        window.open(chatGPTUrl, '_blank', 'noopener,noreferrer');
    };

    const generatePrompts = () => {
        const baseContext = context ? ` about ${context}` : '';
        const questionContext = currentQuestion ? `\n\nCurrent question: "${currentQuestion}"` : '';

        return [
            {
                label: "Explain Concepts",
                prompt: `I'm studying${baseContext} and need help understanding the concepts. Please explain the key topics I should know without giving direct answers to exam questions.${questionContext}`,
                description: "Get explanations of important concepts"
            },
            {
                label: "Study Tips",
                prompt: `I'm preparing for an exam${baseContext}. What are the most important topics I should focus on? Give me study strategies and tips to better understand the material.${questionContext}`,
                description: "Learn effective study strategies"
            },
            {
                label: "Practice Questions",
                prompt: `Create practice questions${baseContext} that will help me test my understanding. Make them similar in difficulty to professional certification exams.${questionContext}`,
                description: "Generate similar practice questions"
            },
            {
                label: "Clarify This Question",
                prompt: currentQuestion ? `Help me understand what this question is asking and what concepts it's testing, but don't give me the answer: "${currentQuestion}"` : `Help me understand the concepts being tested in my current study material${baseContext}.`,
                description: "Understand what the question is testing"
            },
            {
                label: "Memory Techniques",
                prompt: `What are some effective memory techniques and mnemonics to remember key information${baseContext}? Help me create memorable ways to study this material.${questionContext}`,
                description: "Learn memory aids and mnemonics"
            }
        ];
    };

    return (
        <>
            {/* Floating Chat Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {!isOpen ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
                                title="Open AI Assistant"
                            >
                                <Bot className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* AI Assistant Side Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ duration: 0.3 }}
                        className="fixed right-0 top-0 bottom-0 w-1/2 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                <h3 className="font-semibold">AI Study Assistant</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="space-y-6">
                                {/* Welcome Message */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Bot className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-lg font-semibold text-blue-900 mb-2">
                                                AI Study Assistant
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                I can help you understand concepts and improve your learning!
                                                Click any prompt below to open ChatGPT with a pre-written question
                                                tailored to your current study session.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Question Context */}
                                {currentQuestion && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Current Question
                                        </h4>
                                        <div className="bg-white p-3 rounded border text-sm text-slate-700 mb-3">
                                            {currentQuestion.length > 300
                                                ? currentQuestion.substring(0, 300) + "..."
                                                : currentQuestion}
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(currentQuestion);
                                                    setCopiedText('question');
                                                } catch {
                                                    console.error('Failed to copy');
                                                }
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                        >
                                            {copiedText === 'question' ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3 mr-1" />
                                                    Copy Question
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {/* AI Prompts */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                                        AI Study Prompts
                                    </h4>

                                    {generatePrompts().map((promptItem, index) => (
                                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-slate-800 mb-1">
                                                        {promptItem.label}
                                                    </h5>
                                                    <p className="text-sm text-slate-600 mb-3">
                                                        {promptItem.description}
                                                    </p>
                                                    <div className="bg-white p-3 rounded border text-xs text-slate-700 mb-3 font-mono">
                                                        {promptItem.prompt.substring(0, 150)}...
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        copyToClipboard(promptItem.prompt, promptItem.label);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                >
                                                    {copiedText === promptItem.label ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3 mr-1" />
                                                            Copy Prompt
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    onClick={() => openChatGPTWithPrompt(promptItem.prompt)}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-xs"
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    Open ChatGPT
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Instructions */}
                                <div className="bg-slate-800 text-white rounded-lg p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Bot className="w-4 h-4" />
                                        How to Use This Assistant
                                    </h4>
                                    <ol className="text-sm space-y-2 list-decimal list-inside">
                                        <li>Choose a prompt that matches what you want to learn</li>
                                        <li>Click &quot;Open ChatGPT&quot; to launch it with your prompt</li>
                                        <li>Or copy the prompt and paste it into any AI assistant</li>
                                        <li>Ask follow-up questions to deepen your understanding</li>
                                    </ol>
                                    <div className="mt-3 p-3 bg-slate-700 rounded text-xs">
                                        💡 <strong>Pro tip:</strong> These prompts are designed to help you learn concepts
                                        rather than get direct answers. This improves your understanding and retention!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
