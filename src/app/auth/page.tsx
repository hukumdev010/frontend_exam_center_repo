"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { AuthButton } from "@/components/AuthButtonWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, Award, Users } from "lucide-react";

export default function AuthPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Redirect authenticated users to dashboard
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
                                <GraduationCap className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                            Welcome to Exam Center
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Your comprehensive platform for certification exam preparation and expert tutoring
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <Card className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                                    <Award className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-900">Practice Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600">
                                    Access thousands of practice questions across multiple certification categories
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-indigo-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="bg-indigo-100 p-3 rounded-full w-fit mx-auto mb-4">
                                    <Users className="w-8 h-8 text-indigo-600" />
                                </div>
                                <CardTitle className="text-indigo-900">Expert Tutoring</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600">
                                    Get personalized guidance from certified professionals and industry experts
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-900">Progress Tracking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600">
                                    Monitor your learning progress and identify areas for improvement
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sign In Section */}
                    <Card className="max-w-md mx-auto border-gray-200 shadow-xl">
                        <CardHeader className="text-center space-y-4">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Get Started
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Sign in with your Google account to access your personalized learning dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <AuthButton />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    By signing in, you agree to our terms of service and privacy policy
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Why Choose Exam Center?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="flex items-start space-x-4 text-left">
                                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Content</h3>
                                    <p className="text-gray-600">Extensive question banks covering all major certification exams</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 text-left">
                                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
                                    <p className="text-gray-600">Learn from qualified teachers and industry professionals</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 text-left">
                                <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Flexible Learning</h3>
                                    <p className="text-gray-600">Study at your own pace with personalized learning paths</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 text-left">
                                <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                                    <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Real-time Progress</h3>
                                    <p className="text-gray-600">Track your performance and identify improvement areas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}