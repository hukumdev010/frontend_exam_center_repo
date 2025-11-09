/**
 * Development utilities for debugging hydration mismatches and handling browser extensions
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Safely logs hydration debugging information only in development
 */
export const logHydrationDebug = (message: string, data?: unknown) => {
    if (isDev && typeof window !== 'undefined') {
        console.group(`🔄 Hydration Debug: ${message}`);
        if (data) {
            console.log(data);
        }
        console.groupEnd();
    }
};

/**
 * Browser extension attributes that commonly cause hydration mismatches
 */
const EXTENSION_ATTRIBUTES = [
    'bis_skin_checked',
    '__processed_',
    'data-gramm',
    'data-gramm_editor',
    'data-darkreader',
    'grammarly-extension',
    'data-adblock',
    'data-honey-extension',
    'data-lastpass',
    'data-bitwarden',
    '_target',
    'spellcheck',
] as const;

/**
 * CSS selectors that indicate extension interference
 */
const EXTENSION_SELECTORS = [
    '[bis_skin_checked]',
    '[data-gramm]',
    '[data-darkreader]',
    '.grammarly-extension',
    '[data-adblock]',
    '[data-honey-extension]',
] as const;

/**
 * Checks if we're in a browser environment with extensions
 */
export const hasExtensionInterference = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check document for extension artifacts
    const hasAttributeInterference = EXTENSION_ATTRIBUTES.some(attr => {
        return (
            document.body.hasAttribute(attr) || 
            document.documentElement.hasAttribute(attr) ||
            document.body.getAttribute('class')?.includes(attr)
        );
    });

    // Check for extension-injected elements using valid CSS selectors
    const hasSelectorInterference = EXTENSION_SELECTORS.some(selector => {
        try {
            return !!document.querySelector(selector);
        } catch {
            // Skip invalid selectors
            return false;
        }
    });

    // Check for dynamic attributes like __processed_* manually
    const checkElementForDynamicAttributes = (element: Element): boolean => {
        return Array.from(element.attributes).some(attr => 
            attr.name.includes('__processed_') || 
            attr.name.startsWith('bis_') ||
            attr.name.includes('gramm')
        );
    };

    // Check body and html elements first (most common)
    const hasDynamicAttributes = checkElementForDynamicAttributes(document.body) || 
                                checkElementForDynamicAttributes(document.documentElement);

    // If not found on main elements, check a sample of other elements
    let hasElementDynamicAttributes = false;
    if (!hasDynamicAttributes) {
        const sampleElements = document.querySelectorAll('div, span, button, a');
        // Only check first 10 elements for performance
        const elementsToCheck = Array.from(sampleElements).slice(0, 10);
        hasElementDynamicAttributes = elementsToCheck.some(checkElementForDynamicAttributes);
    }

    return hasAttributeInterference || hasSelectorInterference || hasDynamicAttributes || hasElementDynamicAttributes;
};

/**
 * Clean extension attributes from elements to prevent hydration mismatches
 */
export const cleanExtensionAttributes = (element?: HTMLElement) => {
    if (typeof window === 'undefined') return;
    
    const targetElement = element || document.body;
    
    // Clean the target element and its children
    const cleanElement = (el: Element) => {
        if (!el || typeof el.removeAttribute !== 'function') return;
        
        // Remove known extension attributes
        EXTENSION_ATTRIBUTES.forEach((attr) => {
            if (el.hasAttribute(attr)) {
                el.removeAttribute(attr);
            }
        });

        // Remove dynamic attributes that match patterns
        const attributesToRemove: string[] = [];
        Array.from(el.attributes).forEach((attribute) => {
            if (attribute.name.includes('__processed_') || 
                attribute.name.startsWith('bis_') ||
                attribute.name.includes('gramm') ||
                attribute.name.startsWith('data-gramm')) {
                attributesToRemove.push(attribute.name);
            }
        });
        
        attributesToRemove.forEach((name) => {
            try {
                el.removeAttribute(name);
            } catch {
                // Ignore errors removing attributes
            }
        });
    };

    // Clean the target element
    cleanElement(targetElement);
    
    // Clean child elements
    const childElements = targetElement.querySelectorAll('*');
    Array.from(childElements).forEach(cleanElement);
};

/**
 * Suppress hydration warnings for browser extension interference
 */
export const suppressExtensionHydrationWarnings = () => {
    if (typeof window === 'undefined') return;

    // Clean attributes immediately
    cleanExtensionAttributes();

    // Set up mutation observer to clean attributes as they're added
    const setupMutationObserver = () => {
        if (!document.body) {
            // Body not ready, skip observer setup
            return;
        }
        
        try {
            const observer = new MutationObserver((mutations) => {
                try {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.target && mutation.attributeName) {
                            const target = mutation.target as HTMLElement;
                            const attributeName = mutation.attributeName;
                            
                            if (attributeName && EXTENSION_ATTRIBUTES.some(attr => 
                                attributeName.includes(attr) || attributeName.startsWith(attr)
                            )) {
                                try {
                                    if (typeof target.removeAttribute === 'function') {
                                        target.removeAttribute(attributeName);
                                    }
                                } catch {
                                    // Ignore removal errors
                                }
                            }
                        }
                    });
                } catch {
                    // Ignore mutation processing errors
                }
            });

            observer.observe(document.body, {
                attributes: true,
                subtree: true
            });
            
            logHydrationDebug('MutationObserver setup successful');
        } catch {
            // MutationObserver setup failed, continue without it
            logHydrationDebug('MutationObserver setup failed, continuing without real-time cleaning');
        }
    };

    // Set up observer
    setupMutationObserver();

    // Patch console methods to suppress warnings only if we detect interference
    if (hasExtensionInterference()) {
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.warn = (...args: unknown[]) => {
            const message = args.join(' ');
            if (isExtensionRelatedHydrationMessage(message)) {
                logHydrationDebug('Suppressed extension-related hydration warning', message);
                return;
            }
            originalWarn.apply(console, args);
        };
        
        console.error = (...args: unknown[]) => {
            const message = args.join(' ');
            if (isExtensionRelatedHydrationMessage(message)) {
                logHydrationDebug('Suppressed extension-related hydration error', message);
                return;
            }
            originalError.apply(console, args);
        };
    }
};

/**
 * Check if a console message is related to extension-caused hydration issues
 */
const isExtensionRelatedHydrationMessage = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    return (
        lowerMessage.includes('hydration') && 
        EXTENSION_ATTRIBUTES.some(attr => lowerMessage.includes(attr.toLowerCase()))
    ) || (
        lowerMessage.includes('hydration') && 
        (lowerMessage.includes('browser extension') ||
         lowerMessage.includes('extension interfering') ||
         lowerMessage.includes('mismatch'))
    );
};

/**
 * Initialize hydration protection on app start
 */
export const initHydrationProtection = () => {
    if (typeof window === 'undefined') return;
    
    // Clean existing attributes
    cleanExtensionAttributes();
    
    // Set up protection (without MutationObserver if it fails)
    suppressExtensionHydrationWarnings();
    
    // Log debug info
    const interferenceDetected = hasExtensionInterference();
    if (interferenceDetected) {
        logHydrationDebug('Browser extension interference detected and mitigated');
    }
    
    // Set up periodic cleaning as fallback (less aggressive than MutationObserver)
    if (interferenceDetected) {
        const periodicClean = () => {
            try {
                cleanExtensionAttributes();
            } catch {
                // Continue if cleaning fails
            }
        };
        
        // Clean every 2 seconds during development
        if (process.env.NODE_ENV === 'development') {
            setInterval(periodicClean, 2000);
        }
    }
};