"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ExamQuiz } from "@/components/ExamQuiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

type Question = {
    id: number;
    text: string;
    explanation?: string;
    points: number;
    answers: Answer[];
};

type Answer = {
    id: number;
    text: string;
    isCorrect: boolean;
};

type Certification = {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    questions: Question[];
};

function QuizPageContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [certificationData, setCertificationData] = useState<Certification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const certificationSlug = params.certification as string;
    const currentQuestion = parseInt(searchParams.get('q') || '0');

    useEffect(() => {
        const fetchCertificationData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(API_ENDPOINTS.certifications(certificationSlug));
                if (!response.ok) {
                    throw new Error('Failed to fetch certification data');
                }
                const data = await response.json();
                setCertificationData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (certificationSlug) {
            fetchCertificationData();
        }
    }, [certificationSlug]);

    const handleBackToHome = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Categories
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
                    <div className="p-8">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                            <p className="mt-2 text-slate-600">Loading certification...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Categories
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
                    <div className="p-8">
                        <div className="text-center">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <p className="text-red-600 mb-4">Error: {error}</p>
                                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!certificationData) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Categories
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
                    <div className="p-8">
                        <div className="text-center">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                <p className="text-slate-600">No questions found for this certification.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            onClick={handleBackToHome}
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Categories
                        </Button>
                    </div>
                </div>
            </div>
            <div className="max-w-[1600px] mx-auto bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-blue-100/50 mt-6">
                <ExamQuiz
                    questions={certificationData.questions}
                    certificationName={certificationData.name}
                    certificationSlug={certificationSlug}
                    certificationId={certificationData.id}
                    initialQuestion={currentQuestion}
                />
            </div>
        </main>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        }>
            <QuizPageContent />
        </Suspense>
    );
}
