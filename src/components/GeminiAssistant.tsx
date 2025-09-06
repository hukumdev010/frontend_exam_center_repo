"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Bot, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "@/lib/api-config";

interface GeminiAssistantProps {
    currentQuestion?: string;
    context?: string;
}

interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export function GeminiAssistant({ currentQuestion, context }: GeminiAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiHealthy, setApiHealthy] = useState(false);

    useEffect(() => {
        // Check if AI service is available
        const checkAIHealth = async () => {
            try {
                const token = localStorage.getItem('auth_token') || 'mock_token';
                const response = await fetch(API_ENDPOINTS.ai.health, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setApiHealthy(data.gemini_configured);
                }
            } catch (error) {
                console.error('Failed to check AI health:', error);
                setApiHealthy(false);
            }
        };

        checkAIHealth();
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Add welcome message when opening
            const welcomeMessage: ChatMessage = {
                id: Date.now().toString(),
                content: `Hello! I'm your AI study assistant powered by Google Gemini. I can help you understand concepts and explain topics related to your exam.

${context ? `I see you're working on: ${context}` : ""}
${currentQuestion ? `\nCurrent question: "${currentQuestion.substring(0, 100)}${currentQuestion.length > 100 ? "..." : ""}"` : ""}

How can I help you study today?`,
                isUser: false,
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, context, currentQuestion, messages.length]);

    const sendMessage = async () => {
        if (!inputValue.trim() || !apiHealthy || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: inputValue,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem('auth_token') || 'mock_token';

            const requestBody = {
                message: inputValue,
                context: context,
                current_question: currentQuestion,
                conversation_history: messages.map(msg => ({
                    content: msg.content,
                    is_user: msg.isUser
                }))
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

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: data.response || "I'm sorry, I couldn't generate a response.",
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error calling AI API:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickPrompts = [
        "Explain the key concepts in this question",
        "What should I study for this topic?",
        "Give me a simple explanation of this concept",
        "What are some memory techniques for this?",
        "Create practice questions similar to this one"
    ];

    const handleQuickPrompt = (prompt: string) => {
        setInputValue(prompt);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating AI Button */}
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
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
                                title="Open AI Assistant"
                            >
                                <Sparkles className="w-6 h-6" />
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
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-semibold">Gemini AI Assistant</h3>
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

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : 'bg-slate-100 text-slate-800'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!message.isUser && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-4 h-4" />
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-sm text-slate-600">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Prompts */}
                        {messages.length <= 1 && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                <p className="text-xs font-medium text-slate-600 mb-2">Quick prompts:</p>
                                <div className="flex flex-wrap gap-1">
                                    {quickPrompts.map((prompt, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickPrompt(prompt)}
                                            className="text-xs"
                                        >
                                            {prompt}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-200">
                            {!apiHealthy && (
                                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                        <strong>AI Service Unavailable:</strong> The AI assistant is currently not configured or unavailable. Please check your backend configuration.
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Backend should have GENINI_API configured with a valid Gemini API key.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={apiHealthy ? "Ask me anything about your studies..." : "AI service unavailable"}
                                    className="flex-1 p-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={2}
                                    disabled={!apiHealthy || isLoading}
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!apiHealthy || !inputValue.trim() || isLoading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
