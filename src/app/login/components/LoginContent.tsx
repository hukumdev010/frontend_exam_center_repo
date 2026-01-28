"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { AuthService } from "@/app/auth/services";
import CookieManager from "@/lib/cookie-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Shield, Award, Users } from "lucide-react";
import Link from "next/link";

function LoginPageContent() {
    const { isAuthenticated, isLoading, login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState("");
    const [showLoginForm, setShowLoginForm] = useState(false);

    useEffect(() => {
        // Check if we should show the login form directly
        const formParam = searchParams?.get('form');
        if (formParam === 'true') {
            setShowLoginForm(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleGoogleLogin = async () => {
        try {
            setError(null);
            const { auth_url } = await AuthService.getGoogleAuthUrl();
            window.location.href = auth_url;
        } catch {
            setError("Failed to initiate Google login");
        }
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await AuthService.loginWithEmailPassword(email, password);

            // Store the token and user data in cookies
            CookieManager.setCookie("access_token", response.access_token, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: true,
                sameSite: 'Lax',
                path: '/'
            });
            CookieManager.setCookie("user", JSON.stringify(response.user), {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: true,
                sameSite: 'Lax',
                path: '/'
            });

            // Update auth context
            login(response.user, response.access_token);

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await AuthService.registerUser(name, email, password);

            // After successful registration, automatically log in
            const response = await AuthService.loginWithEmailPassword(email, password);

            // Store in cookies
            CookieManager.setCookie("access_token", response.access_token, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: true,
                sameSite: 'Lax',
                path: '/'
            });
            CookieManager.setCookie("user", JSON.stringify(response.user), {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: true,
                sameSite: 'Lax',
                path: '/'
            });

            login(response.user, response.access_token);

            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Redirecting to dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {!showLoginForm ? (
                // Landing Page View
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">{/* Features content moved here */}

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
                                    <Button
                                        onClick={handleGoogleLogin}
                                        variant="outline"
                                        size="lg"
                                        className="w-full h-12 border-gray-200 hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-500">or</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowLoginForm(true)}
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12"
                                >
                                    Sign in with Email
                                </Button>
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
                                Why Choose EduNeps?
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
            ) : (
                // Login Form View
                <div className="flex items-center justify-center p-4 min-h-screen">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to EduNeps</h1>
                            <p className="text-gray-600">
                                {isRegistering ? "Create your account to get started" : "Sign in to continue your learning journey"}
                            </p>
                        </div>

                        <Card className="shadow-xl border-0">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-center">
                                    {isRegistering ? "Create Account" : "Sign In"}
                                </CardTitle>
                                <CardDescription className="text-center">
                                    {isRegistering
                                        ? "Join thousands of learners achieving their certification goals"
                                        : "Choose your preferred method to sign in"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Google Login */}
                                <Button
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-500">or</span>
                                    </div>
                                </div>

                                {/* Email/Password Form */}
                                <form onSubmit={isRegistering ? handleRegister : handleEmailPasswordLogin} className="space-y-4">
                                    {isRegistering && (
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required={isRegistering}
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-12 pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-12 pl-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {isRegistering ? "Creating Account..." : "Signing In..."}
                                            </div>
                                        ) : (
                                            isRegistering ? "Create Account" : "Sign In"
                                        )}
                                    </Button>
                                </form>

                                {/* Toggle between login/register */}
                                <div className="text-center">
                                    <button
                                        onClick={() => {
                                            setIsRegistering(!isRegistering);
                                            setError(null);
                                            setEmail("");
                                            setPassword("");
                                            setName("");
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {isRegistering
                                            ? "Already have an account? Sign in"
                                            : "Don't have an account? Create one"
                                        }
                                    </button>
                                </div>

                                {/* Back to landing page */}
                                <div className="text-center">
                                    <button
                                        onClick={() => setShowLoginForm(false)}
                                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                                    >
                                        Back to home page
                                    </button>
                                </div>

                                {/* Demo Accounts Info */}
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <h4 className="font-medium text-gray-900 text-sm">Demo Accounts:</h4>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <p><strong>Teacher:</strong> sarah.test@examcenter.com / teacher123</p>
                                        <p><strong>Student:</strong> alice.student@examcenter.com / student123</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Footer */}
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-500">
                                By signing in, you agree to our{" "}
                                <Link href="/terms" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPageContent;
