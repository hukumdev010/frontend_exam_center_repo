'use client';

import { ReactNode } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';

interface NoSSRProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client side
 * Useful for preventing hydration mismatches
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
    const hasMounted = useHasMounted();

    if (!hasMounted) {
        return fallback;
    }

    return children;
}