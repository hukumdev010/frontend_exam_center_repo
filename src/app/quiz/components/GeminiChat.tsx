"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, Maximize2, Minimize2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface GeminiChatProps {
    currentQuestion?: string;
    context?: string;
    className?: string;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

export function GeminiChat({ currentQuestion, context, className = '' }: GeminiChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateSystemPrompt = () => {
        let systemPrompt = "You are a helpful AI tutor assisting students with their exam questions. ";
        systemPrompt += "Provide comprehensive, educational explanations that help students understand concepts thoroughly. ";
        systemPrompt += "Focus on teaching and helping students learn with detailed explanations, examples, and step-by-step breakdowns. ";

        if (context) {
            systemPrompt += `Context: The student is taking a ${context}. `;
        }

        if (currentQuestion) {
            systemPrompt += `Current question they might ask about: "${currentQuestion}". `;
        }

        systemPrompt += "Provide detailed responses with examples, explanations of concepts, and practical applications. ";
        systemPrompt += "Use markdown formatting for better readability including headers, lists, and code blocks when appropriate. ";
        systemPrompt += "If asked about the specific question, provide thorough conceptual explanations and teach the underlying principles rather than just giving direct answers. ";
        systemPrompt += "Don't truncate your responses - provide complete, comprehensive answers that fully address the student's question.";

        return systemPrompt;
    };

    const callGeminiAPI = async (userMessage: string) => {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const systemPrompt = generateSystemPrompt();

        // Prepare conversation history for better context
        const conversationHistory = messages.slice(-6).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Add system context and current message
        const requestBody = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                },
                ...conversationHistory,
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Unexpected API response format');
        }

        return data.candidates[0].content.parts[0].text;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);

        // Add user message
        const userMessageObj: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessageObj]);
        setIsLoading(true);

        try {
            const aiResponse = await callGeminiAPI(userMessage);

            const aiMessageObj: Message = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessageObj]);
        } catch (err) {
            console.error('Gemini API error:', err);
            setError(err instanceof Error ? err.message : 'Failed to get AI response');

            // Add error message
            const errorMessageObj: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessageObj]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    const addQuestionContext = () => {
        if (!currentQuestion) return;

        const contextMessage = `Can you help me understand this question: "${currentQuestion}"?`;
        setInput(contextMessage);
        inputRef.current?.focus();
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const renderFullScreenModal = () => {
        if (!isFullScreen || !isMounted) return null;

        const modalContent = (
            <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" />

                {/* Modal Container */}
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4">
                    <div className="w-full h-full max-w-6xl bg-white flex flex-col rounded-lg shadow-2xl">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">AI Chat</h3>
                                        <p className="text-sm text-purple-100">Ask me anything!</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {messages.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearChat}
                                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                            title="Clear chat"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleFullScreen}
                                        className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                        title="Close fullscreen"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                            {messages.length === 0 ? (
                                <div className="text-center text-slate-500 py-8">
                                    <Bot className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                    <p className="text-lg font-medium mb-2">Start a conversation</p>
                                    <p className="text-sm mb-4">Ask me anything about your exam topics!</p>

                                    {currentQuestion && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addQuestionContext}
                                            className="text-xs"
                                        >
                                            Ask about current question
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[85%] rounded-lg px-4 py-3 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white ml-auto'
                                                : 'bg-white border border-slate-200 text-slate-900'
                                                }`}
                                        >
                                            {message.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none">
                                                    <ReactMarkdown
                                                        components={{
                                                            h1: ({ ...props }) => <h1 className="text-lg font-bold mb-2 text-slate-900" {...props} />,
                                                            h2: ({ ...props }) => <h2 className="text-base font-semibold mb-2 text-slate-800" {...props} />,
                                                            h3: ({ ...props }) => <h3 className="text-sm font-semibold mb-1 text-slate-800" {...props} />,
                                                            p: ({ ...props }) => <p className="mb-2 text-slate-700 text-sm leading-relaxed" {...props} />,
                                                            ul: ({ ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1 text-slate-700 text-sm" {...props} />,
                                                            ol: ({ ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1 text-slate-700 text-sm" {...props} />,
                                                            li: ({ ...props }) => <li className="text-slate-700 text-sm" {...props} />,
                                                            code: ({ ...props }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-slate-800" {...props} />,
                                                            pre: ({ ...props }) => <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto mb-2 border" {...props} />,
                                                            strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="text-sm">{message.content}</div>
                                            )}
                                        </div>

                                        {message.role === 'user' && (
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-sm">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0 rounded-b-lg">
                            <div className="flex gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about your exam..."
                                    className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    rows={2}
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 self-end"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    Press Enter to send, Shift+Enter for new line
                                </p>

                                {currentQuestion && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={addQuestionContext}
                                        className="text-xs text-purple-600 hover:text-purple-700 h-auto p-1"
                                    >
                                        Ask about question
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

        return createPortal(modalContent, document.body);
    };

    if (!GEMINI_API_KEY) {
        return (
            <>
                {renderFullScreenModal()}
                <div className={`flex flex-col h-full ${className}`}>
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg p-2">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">AI Chat</h3>
                                    <p className="text-sm text-purple-100">Study Assistant</p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullScreen}
                                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                title={isFullScreen ? "Exit fullscreen" : "Open fullscreen"}
                            >
                                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center text-slate-500">
                            <Bot className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                            <p className="text-sm font-medium mb-2">Chat Not Available</p>
                            <p className="text-xs">Gemini API key not configured</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {renderFullScreenModal()}
            <div className={`flex flex-col h-full ${className}`}>
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 rounded-lg p-2">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">AI Chat</h3>
                                <p className="text-sm text-purple-100">Ask me anything!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearChat}
                                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                    title="Clear chat"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullScreen}
                                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                title="Open fullscreen"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            <Bot className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                            <p className="text-lg font-medium mb-2">Start a conversation</p>
                            <p className="text-sm mb-4">Ask me anything about your exam topics!</p>

                            {currentQuestion && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addQuestionContext}
                                    className="text-xs"
                                >
                                    Ask about current question
                                </Button>
                            )}
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`max-w-[85%] rounded-lg px-4 py-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white ml-auto'
                                        : 'bg-white border border-slate-200 text-slate-900'
                                        }`}
                                >
                                    {message.role === 'assistant' ? (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ ...props }) => <h1 className="text-lg font-bold mb-2 text-slate-900" {...props} />,
                                                    h2: ({ ...props }) => <h2 className="text-base font-semibold mb-2 text-slate-800" {...props} />,
                                                    h3: ({ ...props }) => <h3 className="text-sm font-semibold mb-1 text-slate-800" {...props} />,
                                                    p: ({ ...props }) => <p className="mb-2 text-slate-700 text-sm leading-relaxed" {...props} />,
                                                    ul: ({ ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1 text-slate-700 text-sm" {...props} />,
                                                    ol: ({ ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1 text-slate-700 text-sm" {...props} />,
                                                    li: ({ ...props }) => <li className="text-slate-700 text-sm" {...props} />,
                                                    code: ({ ...props }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-slate-800" {...props} />,
                                                    pre: ({ ...props }) => <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto mb-2 border" {...props} />,
                                                    strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="text-sm">{message.content}</div>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about your exam..."
                            className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            rows={2}
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 self-end"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Press Enter to send, Shift+Enter for new line
                        </p>

                        {currentQuestion && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={addQuestionContext}
                                className="text-xs text-purple-600 hover:text-purple-700 h-auto p-1"
                            >
                                Ask about question
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}