"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { DashboardLayout } from "./components";
import { TeacherService } from "./teacher/services";

interface UserQualifications {
    is_eligible: boolean;
    qualifications_count: number;
    has_teacher_profile: boolean;
    teacher_status?: string;
    qualifications: TeacherQualification[];
}

interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status, getAuthHeaders } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [qualifications, setQualifications] = useState<UserQualifications | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            checkTeachingEligibility();
        } else if (status !== 'loading') {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id, status]);

    const checkTeachingEligibility = async () => {
        try {
            // Check user's teaching eligibility and qualifications
            const eligibilityResponse = await TeacherService.checkEligibility(getAuthHeaders());
            setQualifications(eligibilityResponse);
        } catch (error) {
            console.error("Error checking teaching eligibility:", error);
            setQualifications({
                is_eligible: false,
                qualifications_count: 0,
                has_teacher_profile: false,
                qualifications: []
            });
        } finally {
            setLoading(false);
        }
    };

    // Get page title based on pathname
    const getPageInfo = () => {
        if (pathname === '/dashboard') {
            return { title: 'Learning & Teaching Hub', description: `Welcome back, ${session?.user?.name || session?.user?.email}!` };
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
        } else {
            return { title: 'Dashboard', description: undefined };
        }
    };

    if (status === 'loading' || loading) {
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