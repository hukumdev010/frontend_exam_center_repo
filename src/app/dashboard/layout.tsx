"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { DashboardLayout } from "./components";
import { useTeacherEligibility } from "@/hooks/useTeacherEligibility";

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { qualifications, isLoading: qualificationsLoading } = useTeacherEligibility();

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);

    // Get page title based on pathname
    const getPageInfo = (): { title: string; description: string } => {
        if (pathname === '/dashboard') {
            return { title: 'EduNeps Dashboard', description: `Welcome back, ${session?.user?.name || session?.user?.email}!` };
        } else if (pathname === '/dashboard/profile') {
            return { title: 'Profile', description: 'Manage your profile and teaching qualifications' };
        } else if (pathname === '/dashboard/categories') {
            return { title: 'Categories', description: 'Browse certification categories and start learning or teaching' };
        } else if (pathname.startsWith('/dashboard/users')) {
            return { title: 'User Management', description: 'Manage users, roles, permissions, and access control' };
        } else if (pathname.startsWith('/dashboard/learning')) {
            return { title: 'Learning Progress', description: 'Track your learning journey and achievements' };
        } else if (pathname.startsWith('/dashboard/teaching')) {
            return { title: 'Teaching Hub', description: 'Manage your teaching sessions and students' };
        } else if (pathname.startsWith('/dashboard/qualifications')) {
            return { title: 'My Qualifications', description: 'View your teaching qualifications and eligibility' };
        } else if (pathname.startsWith('/dashboard/sessions')) {
            return { title: 'Sessions', description: 'Manage your learning and teaching sessions' };
        } else if (pathname.startsWith('/dashboard/certificates')) {
            return { title: 'My Certificates', description: 'View and download your earned certificates' };
        } else if (pathname.startsWith('/dashboard/settings')) {
            return { title: 'Settings', description: 'Manage your account preferences and application settings' };
        } else {
            return { title: 'Dashboard', description: '' };
        }
    };

    if (status === 'loading' || qualificationsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const pageInfo = getPageInfo();

    return (
        <DashboardLayout
            qualifications={qualifications}
            userName={session?.user?.name}
            userEmail={session?.user?.email}
            pageTitle={pageInfo.title}
            pageDescription={pageInfo.description}
        >
            {children}
        </DashboardLayout>
    );
}