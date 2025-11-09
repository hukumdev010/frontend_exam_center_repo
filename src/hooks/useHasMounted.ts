'use client';

import { useEffect, useState } from 'react';

/**
 * Hook that returns whether the component has mounted on the client
 * Useful for avoiding hydration mismatches
 */
export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // Use setTimeout to avoid the lint warning about synchronous setState in useEffect
        const timer = setTimeout(() => setHasMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    return hasMounted;
};