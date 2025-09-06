import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIAssistantContextType {
    isVisible: boolean;
    isLoading: boolean;
    response: string;
    currentQuestion: string;
    showResponse: (question: string, response: string) => void;
    showLoading: (question: string) => void;
    hide: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');

    const showResponse = (question: string, aiResponse: string) => {
        setCurrentQuestion(question);
        setResponse(aiResponse);
        setIsLoading(false);
        setIsVisible(true);
    };

    const showLoading = (question: string) => {
        setCurrentQuestion(question);
        setResponse('');
        setIsLoading(true);
        setIsVisible(true);
    };

    const hide = () => {
        setIsVisible(false);
        setIsLoading(false);
        setResponse('');
        setCurrentQuestion('');
    };

    return (
        <AIAssistantContext.Provider
            value={{
                isVisible,
                isLoading,
                response,
                currentQuestion,
                showResponse,
                showLoading,
                hide
            }}
        >
            {children}
        </AIAssistantContext.Provider>
    );
}

export function useAIAssistant() {
    const context = useContext(AIAssistantContext);
    if (context === undefined) {
        throw new Error('useAIAssistant must be used within an AIAssistantProvider');
    }
    return context;
}
