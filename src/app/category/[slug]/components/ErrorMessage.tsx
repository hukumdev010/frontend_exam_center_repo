"use client";

import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
    error: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        {onRetry && (
                            <Button onClick={onRetry}>
                                Try Again
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}