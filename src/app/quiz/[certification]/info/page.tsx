"use client";

import { useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Clock, Target, BookOpen, Trophy, Users, CheckCircle, Star, GraduationCap, Briefcase } from "lucide-react";
import { useSession } from "@/lib/useAuth";
import Header from "@/components/Header";
import { useCertificationInfo, useStartQuiz } from "@/hooks/useApi";



function QuizInfoPageContent() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const certificationSlug = params.certification as string;

    // Use SWR hook for certification info
    const { data: certificationInfo, isLoading: loading, error } = useCertificationInfo(certificationSlug);

    // Use SWR mutation for starting quiz
    const { trigger: startQuiz, isMutating: startingQuiz, error: startError } = useStartQuiz();

    useEffect(() => {
        // If user has already started, redirect to quiz
        if (certificationInfo?.has_started === true && session?.user) {
            router.push(`/quiz/${certificationSlug}?q=${certificationInfo.current_question || 1}`);
        }
    }, [certificationInfo, session, router, certificationSlug]);

    const handleStartQuiz = async () => {
        if (!session?.user) {
            router.push('/auth/login');
            return;
        }

        try {
            const result = await startQuiz(certificationSlug);
            router.push(result.redirect_to);
        } catch (err) {
            console.error('Failed to start quiz:', err);
            // Error is automatically handled by SWR
        }
    };

    const handleBackToHome = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Header />
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mb-4"></div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Quiz Information</h3>
                            <p className="text-slate-600">Please wait while we prepare the details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100/50 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white h-9 px-3"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
                                <p className="text-red-700 mb-6">{error.message || 'An error occurred while loading the certification information.'}</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleBackToHome}
                                        className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!certificationInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Header />
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-6">
                        <div className="text-center">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                                <div className="text-slate-400 text-4xl mb-4">📚</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Certification Not Found</h3>
                                <p className="text-slate-600 mb-6">This certification doesn&apos;t exist or is not available.</p>
                                <Button
                                    onClick={handleBackToHome}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Browse Other Certifications
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header />

            {/* Main Content Container */}
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={handleBackToHome}
                        className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white h-9 px-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Certifications</span>
                    </Button>
                </div>

                {/* Certification Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 rounded-xl p-3">
                                <Award className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{certificationInfo.name}</h1>
                                <p className="text-blue-100">
                                    {certificationInfo.category?.name} • {certificationInfo.level} Level
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <BookOpen className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-sm text-blue-100">Questions</p>
                                <p className="font-semibold">{certificationInfo.questions_count}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <Clock className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-sm text-blue-100">Duration</p>
                                <p className="font-semibold">{certificationInfo.duration} min</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <Target className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-sm text-blue-100">Pass Score</p>
                                <p className="font-semibold">{certificationInfo.min_score_for_certificate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-slate-700 text-lg leading-relaxed">
                            {certificationInfo.description}
                        </p>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* What You'll Gain */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100/50 shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Trophy className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">What You&apos;ll Gain</h2>
                        </div>

                        {certificationInfo.benefits && (
                            <div className="space-y-3 mb-4">
                                {certificationInfo.benefits.split('\n').filter(Boolean).map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-slate-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {certificationInfo.advantages && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="font-semibold text-green-900 mb-2">Key Advantages:</h3>
                                <p className="text-green-800 text-sm">{certificationInfo.advantages}</p>
                            </div>
                        )}
                    </div>

                    {/* Career Benefits */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100/50 shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Career Impact</h2>
                        </div>

                        {certificationInfo.career_benefits && (
                            <div className="space-y-3 mb-4">
                                {certificationInfo.career_benefits.split('\n').filter(Boolean).map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Star className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-slate-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {certificationInfo.teaching_eligibility && (
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-purple-900">Teaching Opportunity</h3>
                                </div>
                                <p className="text-purple-800 text-sm">
                                    Score {certificationInfo.min_score_for_teaching}% or higher to become a certified teacher on our platform!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Status and Action */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-6">
                    {session?.user ? (
                        // Logged in user content
                        <div className="text-center">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Get Certified?</h2>
                                <p className="text-slate-600">
                                    Start your certification journey now. Your progress will be saved automatically.
                                </p>
                            </div>

                            <Button
                                onClick={handleStartQuiz}
                                disabled={startingQuiz}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {startingQuiz ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Starting Quiz...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Start Certification Quiz
                                    </div>
                                )}
                            </Button>

                            {startError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">
                                        {startError.message || 'Failed to start quiz. Please try again.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Non-logged in user content
                        <div className="text-center">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Test Your Skills?</h2>
                                <p className="text-slate-600 mb-4">
                                    Try the quiz now or create an account to save your progress and get certificates.
                                </p>
                            </div>

                            {/* Primary Action - Try Quiz */}
                            <div className="mb-6">
                                <Button
                                    onClick={() => router.push(`/quiz/${certificationSlug}`)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Try Quiz Now
                                    </div>
                                </Button>
                                <p className="text-xs text-slate-500 mt-2">
                                    *Progress won&apos;t be saved without an account
                                </p>
                            </div>

                            {/* Account Benefits */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Want to save progress & get certified?</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2 text-sm text-blue-800 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Save your progress
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Get official certificate
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Access teaching platform
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Track learning journey
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={() => router.push('/auth/signup')}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 font-semibold rounded-lg"
                                >
                                    Sign Up Free
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/auth/login')}
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-2.5 font-semibold rounded-lg"
                                >
                                    Already have an account? Sign In
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function QuizInfoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading...</h3>
                        <p className="text-slate-600">Preparing quiz information...</p>
                    </div>
                </div>
            </div>
        }>
            <QuizInfoPageContent />
        </Suspense>
    );
}