'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import { authService as tokenService } from '@/lib/auth-service';
import { API_ENDPOINTS } from '@/lib/api-config';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    setMessage(error);
                    return;
                }

                if (!token) {
                    setStatus('error');
                    setMessage('No authentication token received');
                    return;
                }

                // Store the token and get user info
                localStorage.setItem('auth_token', token);

                // Update the auth service with the new token
                tokenService.setToken(token);

                // Get user info from backend
                const userResponse = await fetch(`${API_ENDPOINTS.auth.me}?token=${token}`);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem('user_data', JSON.stringify(userData));

                    // Notify auth service of successful login
                    authService.updateAuthState(true, userData);

                    setStatus('success');
                    setMessage('Login successful! Redirecting...');

                    // Redirect to home page after a brief delay
                    setTimeout(() => {
                        router.push('/');
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage('Failed to get user information');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Authentication failed');
                console.error('Auth callback error:', error);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Signing you in...
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please wait while we complete your authentication.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-green-100">
                                <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Welcome!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {message}
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-red-100">
                                <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Authentication Error
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {message}
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Return to Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
