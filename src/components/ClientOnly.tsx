"use client";

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * ClientOnly component ensures that children are only rendered on the client side,
 * preventing hydration mismatches in SSR scenarios.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // Use a timeout to avoid calling setState during render
        const timer = setTimeout(() => setHasMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}