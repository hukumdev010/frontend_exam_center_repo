'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import CookieManager from '@/lib/cookie-manager';
import { AuthService } from '../services';

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
                CookieManager.setCookie('auth_token', token, {
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                    secure: true,
                    sameSite: 'Lax',
                    path: '/'
                });

                // Get user info from backend
                try {
                    const userData = await AuthService.getCurrentUser({
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    });

                    // Store user data in cookie
                    CookieManager.setCookie('user_data', JSON.stringify(userData), {
                        maxAge: 7 * 24 * 60 * 60, // 7 days
                        secure: true,
                        sameSite: 'Lax',
                        path: '/'
                    });

                    // Notify auth service of successful login
                    authService.updateAuthState(true, userData);

                    setStatus('success');
                    setMessage('Login successful! Redirecting...');

                    // Redirect to home page after a brief delay
                    setTimeout(() => {
                        router.push('/');
                    }, 1500);
                } catch (error) {
                    console.error('Failed to get user information:', error);
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
        <div className="bg-gray-50">
            <div className="flex items-center justify-center min-h-screen">
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
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="bg-gray-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
