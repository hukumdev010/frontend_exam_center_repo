'use client';

import { useEffect } from 'react';

/**
 * Enhanced hydration protection component
 * Provides comprehensive protection against browser extension interference
 */
export default function SimpleHydrationProtection() {
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Comprehensive list of extension attributes that cause hydration mismatches
        const extensionAttributes = [
            'bis_skin_checked',
            'bis_register',
            'data-gramm',
            'data-gramm_editor',
            'data-darkreader',
            'grammarly-extension',
            'data-adblock',
            'data-honey-extension',
            'data-lastpass',
            'data-bitwarden',
            'data-onepassword',
            'spellcheck',
            '_target',
        ];

        // Enhanced attribute cleaning function
        const cleanExtensionAttributes = () => {
            try {
                // Clean body and documentElement first (most critical)
                [document.body, document.documentElement].forEach(element => {
                    if (element && element.removeAttribute) {
                        // Remove known extension attributes
                        extensionAttributes.forEach(attr => {
                            if (element.hasAttribute(attr)) {
                                element.removeAttribute(attr);
                            }
                        });

                        // Clean dynamic attributes with pattern matching
                        const attributesToRemove: string[] = [];
                        Array.from(element.attributes).forEach(attribute => {
                            const name = attribute.name;
                            if (name.includes('__processed_') ||
                                name.startsWith('bis_') ||
                                name.includes('gramm') ||
                                name.startsWith('data-gramm') ||
                                name.includes('darkreader') ||
                                name.includes('lastpass') ||
                                name.includes('bitwarden') ||
                                name.includes('onepassword') ||
                                name.includes('honey') ||
                                name.includes('adblock')) {
                                attributesToRemove.push(name);
                            }
                        });

                        attributesToRemove.forEach(name => {
                            try {
                                element.removeAttribute(name);
                            } catch {
                                // Ignore removal errors
                            }
                        });
                    }
                });

                // Use TreeWalker for efficient DOM traversal (better than querySelectorAll)
                const walker = document.createTreeWalker(
                    document.body || document.documentElement,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode: function () {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                );

                let currentNode = walker.nextNode();
                let cleanedCount = 0;
                const maxNodesToClean = 100; // Limit for performance

                while (currentNode && cleanedCount < maxNodesToClean) {
                    const element = currentNode as HTMLElement;
                    if (element && element.removeAttribute) {
                        // Check if element has extension attributes
                        const hasExtensionAttrs = extensionAttributes.some(attr =>
                            element.hasAttribute(attr)
                        );

                        if (hasExtensionAttrs) {
                            // Remove all extension attributes from this element
                            extensionAttributes.forEach(attr => {
                                if (element.hasAttribute(attr)) {
                                    element.removeAttribute(attr);
                                }
                            });

                            // Check for dynamic attributes
                            const attributesToRemove: string[] = [];
                            Array.from(element.attributes).forEach(attribute => {
                                const name = attribute.name;
                                if (name.includes('__processed_') ||
                                    name.startsWith('bis_') ||
                                    name.includes('gramm') ||
                                    name.startsWith('data-gramm')) {
                                    attributesToRemove.push(name);
                                }
                            });

                            attributesToRemove.forEach(name => {
                                try {
                                    element.removeAttribute(name);
                                } catch {
                                    // Ignore removal errors
                                }
                            });
                        }
                    }
                    currentNode = walker.nextNode();
                    cleanedCount++;
                }

            } catch {
                // Log error but continue - don't let cleanup failure break the app
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 Extension cleanup encountered an error during cleaning');
                }
            }
        };

        // Helper function to identify extension from attribute name
        const getExtensionNameFromAttribute = (attributeName: string): string => {
            if (attributeName.includes('bis_') || attributeName === 'bis_skin_checked' || attributeName === 'bis_register') {
                return 'Built-in Security (BiS)';
            }
            if (attributeName.includes('gramm')) {
                return 'Grammarly';
            }
            if (attributeName.includes('darkreader')) {
                return 'Dark Reader';
            }
            if (attributeName.includes('adblock')) {
                return 'AdBlock';
            }
            if (attributeName.includes('honey')) {
                return 'Honey';
            }
            if (attributeName.includes('lastpass')) {
                return 'LastPass';
            }
            if (attributeName.includes('bitwarden')) {
                return 'Bitwarden';
            }
            if (attributeName.includes('onepassword')) {
                return '1Password';
            }
            if (attributeName.includes('__processed_')) {
                return 'Unknown Extension (processed)';
            }
            return 'Unknown Extension';
        };

        // Set up MutationObserver to handle real-time attribute additions
        let observer: MutationObserver | null = null;
        let cleaningCount = 0;
        let lastCleanTime = 0;
        const MAX_CLEANING_COUNT = 50; // Limit cleaning operations
        const CLEANING_THROTTLE = 1000; // 1 second throttle

        const setupMutationObserver = () => {
            if (typeof MutationObserver !== 'undefined' && document.body) {
                try {
                    observer = new MutationObserver((mutations) => {
                        const now = Date.now();

                        // Throttle cleaning operations
                        if (now - lastCleanTime < CLEANING_THROTTLE) {
                            return;
                        }

                        // Stop if we've cleaned too many times
                        if (cleaningCount >= MAX_CLEANING_COUNT) {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('🔄 Extension cleanup: Reached maximum cleaning limit, disabling observer');
                            }
                            if (observer) {
                                observer.disconnect();
                            }
                            return;
                        }

                        let attributesCleaned = 0;

                        for (const mutation of mutations) {
                            if (mutation.type === 'attributes' &&
                                mutation.target &&
                                mutation.attributeName) {

                                const target = mutation.target as HTMLElement;
                                const attributeName = mutation.attributeName;

                                // Check if the added attribute is extension-related
                                if (extensionAttributes.includes(attributeName) ||
                                    attributeName.includes('__processed_') ||
                                    attributeName.startsWith('bis_') ||
                                    attributeName.includes('gramm') ||
                                    attributeName.startsWith('data-gramm')) {

                                    try {
                                        if (target && typeof target.removeAttribute === 'function') {
                                            target.removeAttribute(attributeName);
                                            attributesCleaned++;

                                            // Only log occasionally to prevent spam
                                            if (process.env.NODE_ENV === 'development' && cleaningCount % 10 === 0) {
                                                console.log(`🔄 Cleaned extension attribute: ${attributeName} (${getExtensionNameFromAttribute(attributeName)}) - Count: ${cleaningCount}`);
                                            }
                                        }
                                    } catch {
                                        // Ignore removal errors
                                    }
                                }
                            }
                        }

                        if (attributesCleaned > 0) {
                            cleaningCount += attributesCleaned;
                            lastCleanTime = now;
                        }
                    });

                    observer.observe(document.documentElement, {
                        attributes: true,
                        subtree: true,
                        attributeFilter: extensionAttributes // Only watch for specific attributes
                    });

                    console.log('🔄 Extension cleanup: MutationObserver active (with throttling)');
                } catch {
                    console.log('🔄 Extension cleanup: MutationObserver setup failed, using fallback');
                }
            }
        };

        // Immediate cleanup
        cleanExtensionAttributes();

        // Set up mutation observer
        setupMutationObserver();

        // More conservative periodic cleaning during hydration phase
        const cleanupIntervals = [
            setTimeout(cleanExtensionAttributes, 100),  // Early
            setTimeout(cleanExtensionAttributes, 500),  // Mid
            setTimeout(cleanExtensionAttributes, 2000), // Late
        ];

        // Setup much less frequent ongoing monitoring
        const ongoingCleanup = setInterval(() => {
            // Only check if extensions are still interfering and we haven't cleaned too much
            if (cleaningCount < MAX_CLEANING_COUNT) {
                const hasInterference = extensionAttributes.some(attr =>
                    document.body?.hasAttribute(attr) ||
                    document.documentElement?.hasAttribute(attr)
                );

                if (hasInterference) {
                    cleanExtensionAttributes();
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🔄 Periodic extension cleanup - interference still detected');
                    }
                }
            } else {
                // Stop periodic cleaning if we've hit the limit
                clearInterval(ongoingCleanup);
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 Stopping periodic cleanup - maximum cleanings reached');
                }
            }
        }, 5000); // Check every 5 seconds instead of 2

        // Cleanup function
        return () => {
            cleanupIntervals.forEach(timeout => clearTimeout(timeout));
            clearInterval(ongoingCleanup);
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    return null;
}