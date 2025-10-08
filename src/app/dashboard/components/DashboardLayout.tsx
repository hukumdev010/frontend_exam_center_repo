"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    BookOpen,
    Award,
    Users,
    Calendar,
    User,
    GraduationCap,
    Menu,
    X,
    Bell,
    Settings,
    Target,
    TrendingUp,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    requiresQualification?: boolean;
}

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

interface DashboardLayoutProps {
    children: React.ReactNode;
    qualifications?: UserQualifications | null;
    userName?: string;
    userEmail?: string;
    pageTitle?: string;
    pageDescription?: string;
}

export function DashboardLayout({
    children,
    qualifications,
    userName,
    userEmail,
    pageTitle = "Dashboard",
    pageDescription
}: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const hasTeachingQualifications = qualifications?.is_eligible || false;
    const qualificationCount = qualifications?.qualifications_count || 0;

    // Simple navigation - only show what's relevant
    const learningItems: SidebarItem[] = [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Browse Subjects", href: "/dashboard/categories", icon: BookOpen },
        { title: "Find Teachers", href: "/dashboard/teachers", icon: Users },
        { title: "My Progress", href: "/dashboard/learning", icon: TrendingUp },
        { title: "Quizzes", href: "/quiz", icon: Award },
        { title: "Certificates", href: "/dashboard/certificates", icon: CheckCircle },
    ];

    // Only show teaching items if user actually has qualifications
    const teachingItems: SidebarItem[] = hasTeachingQualifications ? [
        {
            title: "My Teaching",
            href: "/dashboard/teaching",
            icon: Users,
            badge: qualificationCount > 0 ? qualificationCount.toString() : undefined
        },
        {
            title: "Availability",
            href: "/dashboard/teaching/availability",
            icon: Calendar
        },
    ] : [];

    // Account items - always visible
    const accountItems: SidebarItem[] = [
        {
            title: hasTeachingQualifications ? "My Qualifications" : "Become a Teacher",
            href: "/dashboard/qualifications",
            icon: hasTeachingQualifications ? GraduationCap : Target,
            badge: hasTeachingQualifications ? undefined : "Start here!"
        },
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const items = [...learningItems, ...teachingItems, ...accountItems];

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className={cn(
                "flex items-center justify-between border-b px-3 py-4",
                collapsed ? "px-2" : "px-6"
            )}>
                <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    {!collapsed && (
                        <span className="text-xl font-bold text-gray-900">ExamCenter</span>
                    )}
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {items.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-100 text-blue-900"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed ? "" : "mr-3")} />
                            {!collapsed && (
                                <>
                                    <span className="truncate">{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t p-4">
                <div className={cn(
                    "flex items-center gap-3 text-sm text-gray-600",
                    collapsed && "justify-center"
                )}>
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center relative",
                        hasTeachingQualifications ? "bg-green-100" : "bg-blue-100"
                    )}>
                        <User className={cn(
                            "h-4 w-4",
                            hasTeachingQualifications ? "text-green-600" : "text-blue-600"
                        )} />
                        {hasTeachingQualifications && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-2 w-2 text-white" />
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="font-medium">
                                {hasTeachingQualifications ? "Learner + Teacher" : "Learner"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {hasTeachingQualifications
                                    ? `${qualificationCount} Teaching ${qualificationCount === 1 ? 'Subject' : 'Subjects'}`
                                    : "Learning Mode"
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const DashboardHeader = () => (
        <header className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="lg:ml-0 ml-12">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {pageTitle}
                    </h1>
                    {pageDescription && (
                        <p className="text-sm text-gray-600">
                            {pageDescription}
                        </p>
                    )}
                    {!pageDescription && (userName || userEmail) && (
                        <p className="text-sm text-gray-600">
                            Welcome back, {userName || userEmail}!
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {hasTeachingQualifications && (
                        <Badge
                            variant="default"
                            className="px-3 py-1 hidden sm:flex bg-green-100 text-green-800"
                        >
                            Teaching {qualificationCount} {qualificationCount === 1 ? 'Subject' : 'Subjects'}
                        </Badge>
                    )}
                    <Badge
                        variant="secondary"
                        className="px-3 py-1 hidden sm:flex"
                    >
                        {hasTeachingQualifications ? "Learner + Teacher" : "Learner"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="sm"
                className="fixed top-4 left-4 z-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="h-4 w-4" />
            </Button>

            {/* Desktop sidebar */}
            <div className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:transition-all lg:duration-300",
                collapsed ? "lg:w-16" : "lg:w-64"
            )}>
                <SidebarContent />
            </div>

            {/* Mobile sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                collapsed ? "lg:ml-16" : "lg:ml-64"
            )}>
                <DashboardHeader />

                {/* Page Content */}
                <main className="flex-1 overflow-auto px-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}