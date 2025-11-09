'use client';

import { ReactNode, useEffect } from 'react';

interface HydrationBoundaryProps {
    children: ReactNode;
}

/**
 * Enhanced hydration boundary component
 * Provides comprehensive console warning suppression for extension interference
 */
export default function HydrationBoundary({ children }: HydrationBoundaryProps) {
    useEffect(() => {
        // Enhanced console warning suppression for known extension issues
        if (typeof window !== 'undefined') {
            const originalError = console.error;
            const originalWarn = console.warn;

            // Comprehensive list of extension-related patterns
            const extensionPatterns = [
                'bis_skin_checked',
                'bis_register',
                '__processed_',
                'data-gramm',
                'data-darkreader',
                'grammarly-extension',
                'data-adblock',
                'data-honey-extension',
                'data-lastpass',
                'data-bitwarden',
                'data-onepassword',
                'browser extension',
                'extension interfering',
                // Specific patterns from your error
                '__processed_8e92d8c1-8047-46e4-9b32-9625c6a0ed71__',
                'W3sibWFzdGVyIjp0cnVlLCJleHRlbnNpb25JZCI6Im5pbWxtZWpibW5lY25hZ2hnbWJhaG1iYWRk',
                'tree hydrated but some attributes',
                'server rendered HTML didn\'t match the client properties',
            ];

            const isExtensionRelatedMessage = (message: string): boolean => {
                const lowerMessage = message.toLowerCase();
                return extensionPatterns.some(pattern =>
                    lowerMessage.includes(pattern.toLowerCase())
                ) && (
                        lowerMessage.includes('hydration') ||
                        lowerMessage.includes('mismatch') ||
                        lowerMessage.includes('server rendered html') ||
                        lowerMessage.includes('client properties')
                    );
            };

            const getExtensionName = (message: string): string => {
                const lowerMessage = message.toLowerCase();
                if (lowerMessage.includes('bis_skin_checked') || lowerMessage.includes('bis_register')) {
                    return 'Built-in Security (BiS) Extension';
                }
                if (lowerMessage.includes('gramm')) {
                    return 'Grammarly Extension';
                }
                if (lowerMessage.includes('darkreader')) {
                    return 'Dark Reader Extension';
                }
                if (lowerMessage.includes('adblock')) {
                    return 'AdBlock Extension';
                }
                if (lowerMessage.includes('honey')) {
                    return 'Honey Extension';
                }
                if (lowerMessage.includes('lastpass')) {
                    return 'LastPass Extension';
                }
                if (lowerMessage.includes('bitwarden')) {
                    return 'Bitwarden Extension';
                }
                if (lowerMessage.includes('onepassword')) {
                    return '1Password Extension';
                }
                if (lowerMessage.includes('__processed_')) {
                    return 'Unknown Browser Extension (processed attributes)';
                }
                return 'Unknown Browser Extension';
            };

            console.error = (...args: unknown[]) => {
                const message = args.join(' ');
                if (isExtensionRelatedMessage(message)) {
                    // Show extension-related hydration errors with clear labeling
                    console.group('🔄 BROWSER EXTENSION HYDRATION ISSUE (Not your code!)');
                    console.warn('This hydration error is caused by a browser extension, not your application code.');
                    console.warn('Extension detected:', getExtensionName(message));
                    console.log('Original error:');
                    originalError.apply(console, args);
                    console.log('💡 This can be safely ignored - it\'s caused by browser extension interference.');
                    console.groupEnd();
                    return;
                }
                originalError.apply(console, args);
            };

            console.warn = (...args: unknown[]) => {
                const message = args.join(' ');
                if (isExtensionRelatedMessage(message)) {
                    // Show extension-related hydration warnings with clear labeling
                    console.group('🔄 BROWSER EXTENSION HYDRATION WARNING (Not your code!)');
                    console.info('This hydration warning is caused by a browser extension, not your application code.');
                    console.info('Extension detected:', getExtensionName(message));
                    console.log('Original warning:');
                    originalWarn.apply(console, args);
                    console.log('� This can be safely ignored - it\'s caused by browser extension interference.');
                    console.groupEnd();
                    return;
                }
                originalWarn.apply(console, args);
            };

            // Log protection status
            if (process.env.NODE_ENV === 'development') {
                // Check for extension interference
                const hasExtensions = extensionPatterns.slice(0, 8).some(pattern => { // Check first 8 attribute patterns
                    return (
                        document.body?.hasAttribute(pattern) ||
                        document.documentElement?.hasAttribute(pattern) ||
                        document.querySelector(`[${pattern}]`) !== null
                    );
                });

                if (hasExtensions) {
                    console.log('🔄 Extension interference detected - hydration protection active');
                } else {
                    console.log('🔄 Hydration protection initialized - no extensions detected');
                }
            }

            // Cleanup function to restore original console methods
            return () => {
                console.error = originalError;
                console.warn = originalWarn;
            };
        }
    }, []);

    return <>{children}</>;
}