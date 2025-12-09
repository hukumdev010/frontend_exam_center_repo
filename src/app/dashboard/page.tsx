"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useAuth";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Auth redirect effect
    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);

    // Redirect to My Progress page when dashboard is accessed
    useEffect(() => {
        if (status !== 'loading' && status === 'authenticated') {
            router.push("/dashboard/learning");
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // This component now just redirects, so we can show a loading state
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );
}