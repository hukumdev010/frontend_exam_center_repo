"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/useAuth";
import { DashboardLayout } from "./components";
import { TeacherService } from "./teacher/services";

type UserRole = "student" | "teacher" | "admin";

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status, getAuthHeaders } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<UserRole>("student");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push("/auth");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            checkUserRole();
        } else if (status !== 'loading') {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id, status]);

    const checkUserRole = async () => {
        try {
            // Check if user is a teacher
            await TeacherService.getMyProfile(getAuthHeaders());
            setUserRole("teacher");
        } catch (error) {
            console.error("Error checking user role:", error);
            setUserRole("student");
        } finally {
            setLoading(false);
        }
    };

    // Get page title based on pathname
    const getPageInfo = () => {
        if (pathname === '/dashboard') {
            return { title: 'Dashboard', description: `Welcome back, ${session?.user?.name || session?.user?.email}!` };
        } else if (pathname === '/dashboard/profile') {
            return { title: 'Profile', description: 'Manage your profile and teacher application' };
        } else if (pathname === '/dashboard/categories') {
            return { title: 'Categories', description: 'Browse certification categories and start practicing' };
        } else if (pathname.startsWith('/dashboard/student')) {
            return { title: 'Student Portal', description: 'Access your learning materials and track progress' };
        } else if (pathname.startsWith('/dashboard/teacher')) {
            return { title: 'Teaching Dashboard', description: 'Manage your teaching sessions and students' };
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
            userRole={userRole}
            userName={session?.user?.name}
            userEmail={session?.user?.email}
            pageTitle={pageInfo.title}
            pageDescription={pageInfo.description}
        >
            {children}
        </DashboardLayout>
    );
}