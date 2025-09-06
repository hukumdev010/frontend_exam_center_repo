"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { MessageSquare, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatGPTHelperProps {
    currentQuestion?: string;
    context?: string;
}

export function ChatGPTHelper({ currentQuestion, context }: ChatGPTHelperProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [chatWindow, setChatWindow] = useState<Window | null>(null);

    const openChatGPT = () => {
        // Prepare context for ChatGPT
        let prompt = "I'm taking an exam and need help understanding concepts.";

        if (currentQuestion) {
            prompt += ` Here's the current question I'm working on: "${currentQuestion}"`;
        }

        if (context) {
            prompt += ` Additional context: ${context}`;
        }

        prompt += " Can you help me understand the concepts without directly giving me the answer?";

        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);

        // ChatGPT URL with pre-filled prompt
        const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;

        // Open ChatGPT in a new window with specific dimensions
        const newWindow = window.open(
            chatGPTUrl,
            'chatgpt-helper',
            'width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes'
        );

        setChatWindow(newWindow);
        setIsOpen(true);

        // Focus the new window
        if (newWindow) {
            newWindow.focus();
        }
    };

    const closeChatGPT = () => {
        if (chatWindow && !chatWindow.closed) {
            chatWindow.close();
        }
        setChatWindow(null);
        setIsOpen(false);
    };

    const focusChatGPT = () => {
        if (chatWindow && !chatWindow.closed) {
            chatWindow.focus();
        } else {
            // If window was closed, open a new one
            openChatGPT();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
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
                                onClick={openChatGPT}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
                                title="Ask ChatGPT for help"
                            >
                                <MessageSquare className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 min-w-[280px]"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-green-600" />
                                    ChatGPT Helper
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeChatGPT}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-slate-600">
                                    ChatGPT is open in a separate window to help you understand concepts.
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={focusChatGPT}
                                        className="flex-1 text-xs"
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Focus Chat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openChatGPT}
                                        className="flex-1 text-xs"
                                    >
                                        New Chat
                                    </Button>
                                </div>

                                <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded">
                                    <strong>Tip:</strong> Ask ChatGPT to explain concepts rather than giving direct answers to maintain learning integrity.
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
